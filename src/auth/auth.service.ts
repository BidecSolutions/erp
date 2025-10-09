import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from './save-token.entity';
import { In, Not, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { userRoleMapping } from 'src/entities/user-role-mapping.entity';
import { sideMenus } from 'src/entities/side-menu.entity';
import { subSideMenus } from 'src/entities/sub-side-menu.entity';
import { sidemunuRolesMapping } from 'src/entities/role-side-menu-mapping.entity';
import { Permission } from 'src/entities/Permission.entity';
import { subSideMenuPermission } from 'src/entities/sub-side-menu-permission.entity';
import { session } from 'passport';
import { userCompanyMapping } from 'src/entities/user-company-mapping.entity';
import { Branch } from 'src/Company/branch/branch.entity';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,

    @InjectRepository(UserToken)
    private tokenRepo: Repository<UserToken>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Role)
    private usersRoles: Repository<Role>,

    @InjectRepository(userRoleMapping)
    private usersRoleRepository: Repository<userRoleMapping>,

    @InjectRepository(sideMenus)
    private sideMenuRepository: Repository<sideMenus>,

    @InjectRepository(subSideMenus)
    private subSideMenuRepository: Repository<subSideMenus>,

    @InjectRepository(sidemunuRolesMapping)
    private sideMenuMapppingRepository: Repository<sidemunuRolesMapping>,

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    @InjectRepository(subSideMenuPermission)
    private subMenuPermRepository: Repository<subSideMenuPermission>,

    @InjectRepository(Branch)
    private branches: Repository<Branch>,

    @InjectRepository(userCompanyMapping)
    private userCompanyMap: Repository<userCompanyMapping>,

  ) { }

  async saveVerificationCode(email: string, code: string) {
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    await this.usersRepository.update({ email }, {
      two_fa_code: code,
      two_fa_expiry: expiry
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user || user.two_fa_code !== code) return false;

    const now = new Date();
    if (!user.two_fa_expiry || user.two_fa_expiry < now) return false;

    await this.usersRepository.update(
      { email },
      {
        two_fa_code: '',
        two_fa_expiry: '',
      },
    );
    return true;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async fetchUserBranches(userId: number) {
    //here
    const branches = await this.userCompanyMap.findOne({ where: { user_id: userId } })
    let allBranches: Branch[] = [];
    if (branches && Array.isArray(branches.branch_id)) {
      allBranches = await this.branches.find({
        where: { id: In(branches.branch_id), is_active: 1 },
        select: ({ id: true, branch_name: true })
      });
    }
    return allBranches
  }

  async userTokenValidation(token) {
    const found = await this.tokenRepo.findOneBy({ token });
    if (!found) {
      return false;
    }
    else {
      const user = await this.usersRepository.findOne({
        where: { id: found.userId },
        select: ['id', 'name', 'email', 'image', 'status', 'phone', 'address', 'created_at', 'updated_at']
      });
      return user
    }
  }

  async insertUserToken(userId: number, token: string, deviceId: string): Promise<UserToken> {
    const newToken = this.tokenRepo.create({
      userId,
      token,
      deviceId,
      createdAt: new Date(),
    });
    return await this.tokenRepo.save(newToken);
  }

  async removeUserToken(token: string): Promise<boolean> {
    const found = await this.tokenRepo.findOneBy({ token });
    if (!found) return false;
    await this.tokenRepo.remove(found);
    return true;
  }

  async sendResetPasswordEmail(email: string, resetLink: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'tech@akegroup.co.nz',
        pass: 'lchvhaqyjpxzbffo',
      },
    });

    await transporter.sendMail({
      from: '"Support" <your_email@gmail.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }

  async sendResetCodeEmail(email: string, code: string): Promise<void> {
    const frontendURL = `http://localhost:5173/verify-reset-code?email=${encodeURIComponent(email)}`;
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'tech@akegroup.co.nz',
        pass: 'lchvhaqyjpxzbffo',
      },
    });

    await transporter.sendMail({
      from: '"Support" <support@example.com>',
      to: email,
      subject: 'Your Password Reset Code',
      html: `<h3>Password Reset Code</h3><p>Your code: <strong>${code}</strong></p><p>It expires in 10 minutes.</p><p>
        <a href="${frontendURL}" style="display:inline-block;background:#4CAF50;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
      </p>`,

    });
  }







  //New Work Here


  //User Login
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    // 🧩 Fetch role
    const roles = await this.usersRoleRepository
      .createQueryBuilder('urm')
      .innerJoin('roles', 'r', 'urm.roll_id = r.id')
      .select(['r.id as id', 'r.role_name as role_name', 'urm.roll_id as roll_id'])
      .where('urm.user_id = :userId', { userId: user.id })
      .getRawOne();

    const branches = await this.fetchUserBranches(user.id);


    const userDetails = {
      id: user.id,
      name: user.name,
      image: user.image,
      email: user.email,
      status: user.status,
      address: user.address ?? '',
      dob: user.dob ?? '',
      phone: user.phone ?? '',
      role: roles ? roles.role_name : 'No Role',
      role_id: roles ? roles.id : 'No ID',
    };

    let allMenus: any[] = [];
    let userPerms: any[] = [];
    let superAdminMenus = [1, 14, 15]
    // 🚀 Admin & Super Admin
    if (roles?.roll_id == 1 || roles?.roll_id == 2) {
      // Super Admin (1) → All Menus
      if (roles?.roll_id == 1) {
        allMenus = await this.sideMenuRepository.find({
          where: { id: In(superAdminMenus) },
          order: { periority: 'ASC' },
        });
      }
      // Admin (2)
      if (roles?.roll_id == 2) {
        allMenus = await this.sideMenuRepository.find({
          where: { id: Not(In(superAdminMenus)) },
          order: { periority: 'ASC' },
        });
      }
    } else {

      if (branches.length === 0) {
        throw new NotFoundException('You Dont Allow to access. First Assign Branch');
      }
      // 🧠 Normal User — fetch from permission table
      userPerms = await this.permissionRepository.find({
        where: { user_id: user.id },
      });

      const menuIds = [...new Set(userPerms.map((p) => p.menu_id))];

      allMenus = await this.sideMenuRepository.find({
        where: { id: In(menuIds) },
        order: { periority: 'ASC' },
      });
    }

    // 🧩 Build Menu Tree
    const menuTrees = await Promise.all(
      allMenus.map(async (menu) => {
        const subMenus = await this.subSideMenuRepository.find({
          where: { menu_id: menu.id },
        });

        // --- Admin/Super Admin ---
        if (roles?.roll_id == 1 || roles?.roll_id == 2) {
          const subMenusWithPerms = await Promise.all(
            subMenus.map(async (sm) => {
              const perms = await this.subMenuPermRepository.find({
                where: { sub_menu_id: sm.id },
              });
              return {
                id: sm.id,
                name: sm.name,
                link: sm.link,
                permissions: perms.map((p) => ({
                  id: p.id,
                  name: p.name,
                })),
              };
            }),
          );
          return {
            id: menu.id,
            name: menu.name,
            key_name: menu.key_name ?? 'Others',
            subMenus: subMenusWithPerms,
          };
        }

        // --- Normal User ---
        else {
          const subMenusWithPerms = subMenus.map((sm) => {
            const permRecord = userPerms.find(
              (p) => p.sub_menu_id === sm.id && p.menu_id === menu.id,
            );

            return {
              id: sm.id,
              name: sm.name,
              link: sm.link,
              permissions: permRecord?.module_permission || [],
            };
          });

          return {
            id: menu.id,
            name: menu.name,
            key_name: menu.key_name ?? 'Others',
            subMenus: subMenusWithPerms,
          };
        }
      }),
    );

    // 🧩 Group Menus by key_name
    const groupedMenus = menuTrees.reduce((groups, menu) => {
      const key = menu.key_name || 'Others';
      if (!groups[key]) groups[key] = [];
      groups[key].push({
        id: menu.id,
        name: menu.name,
        subMenus: menu.subMenus,
      });
      return groups;
    }, {});

    // ✅ Final Response
    return {
      access_token: accessToken,
      user: userDetails,
      menus: groupedMenus,
      branches,
    };
  }
  //login End

  //Create Menus # 1 
  async createMenuOrSubMenus(body: any) {
    // 1. create the menu
    const menu = this.sideMenuRepository.create({
      name: body.sideMenu.name,
      key_name: body.sideMenu.key_name,
      periority: body.sideMenu.periority,
    });
    const savedMenu = await this.sideMenuRepository.save(menu);

    // 2. create subMenus
    for (const sm of body.subMenus || []) {
      const subMenu = this.subSideMenuRepository.create({
        name: sm.name,
        link: sm.link,
        menu_id: savedMenu.id,
      });
      const savedSubMenu = await this.subSideMenuRepository.save(subMenu);

      // 3. create permissions
      for (const p of sm.permissions || []) {
        const perm = this.subMenuPermRepository.create({
          name: p.name,
          sub_menu_id: savedSubMenu.id,
        });
        await this.subMenuPermRepository.save(perm);
      }
    }
    return { message: 'Menu created successfully', id: savedMenu.id };
  }
  //End Menus

  //Start Get All Menus # 2
  async getSideMenus() {
    const sideMenus = await this.sideMenuRepository.find({
      order: { periority: 'ASC' },
    });
    const menuTrees = await Promise.all(
      sideMenus.map(async (menu) => {
        const subMenus = await this.subSideMenuRepository.find({
          where: { menu_id: menu.id },
        });
        const subMenusWithPerms = await Promise.all(
          subMenus.map(async (sm) => {
            const perms = await this.subMenuPermRepository.find({
              where: { sub_menu_id: sm.id },
            });
            return {
              id: sm.id,
              name: sm.name,
              link: sm.link,
              permissions: perms.map((p) => ({
                id: p.id,
                name: p.name,
              })),
            };
          }),
        );
        return {
          id: menu.id,
          name: menu.name,
          key_name: menu.key_name ?? 'Others', // group key
          subMenus: subMenusWithPerms,
        };
      }),
    );

    return { sideMenus, menuTrees };
  }
  //End Get ALl Menus

  //create Roles and Role Mapping # 3 
  async createRoles(body: any) {
    try {
      if (!body.permission || !Array.isArray(body.permission) || body.permission.length === 0) {
        throw new BadRequestException('Please Assing Side Menu Permissions to the Role');
      }
      const roles = this.usersRoles.create({ role_name: body.role.role_name });
      const savedRole = await this.usersRoles.save(roles);

      const roleMapping = body.permission.map((perm: any) => this.sideMenuMapppingRepository.create({
        role_id: savedRole.id,
        side_menu_id: perm.menu_id,
      }));
      await this.sideMenuMapppingRepository.save(roleMapping);
    }
    catch (error) {
      throw new NotFoundException('Error creating role: ' + error.message);
    }
  }


  async updateRoles(body: any) {
    const role = await this.sideMenuMapppingRepository.find({ where: { role_id: body.role_id } });
    await this.usersRoles.update({ id: body.role.id }, { role_name: body.role.role_name });
    if (role.length > 0) {
      const check = Promise.all(body.permission.map(async (perm: any) => {
        const exist = await this.sideMenuMapppingRepository.findOneBy({ role_id: body.role_id, side_menu_id: perm.menu_id });
        if (!exist) {
          const newRole = this.sideMenuMapppingRepository.create({
            role_id: body.role_id,
            side_menu_id: perm.menu_id,
          });
          await this.sideMenuMapppingRepository.save(newRole);
        }
      }))
    }
  }
  //   if (!body.permission || !Array.isArray(body.permission) || body.permission.length === 0) {
  //     throw new BadRequestException('Please Assing Side Menu Permissions to the Role');
  //   }
  //   const roles = this.usersRoles.create({ role_name: body.role.role_name });
  //   const savedRole = await this.usersRoles.save(roles);

  //   const roleMapping = body.permission.map((perm: any) => this.sideMenuMapppingRepository.create({
  //     role_id: savedRole.id,
  //     side_menu_id: perm.menu_id,
  //   }));
  //   await this.sideMenuMapppingRepository.save(roleMapping);
  //    try {}
  // catch (error) {
  //   throw new NotFoundException('Error creating role: ' + error.message);
  // }

  //End Roles and Role Mapping

  //Get All Roles # 4
  async getAllRoles(body: any) {
    return await this.usersRoles.find({ where: { status: body.status, id: Not(In([1, 2])), } });
  }
  //End Get All Roles

  //get all roles with side menus 
  async getSubMenusByRoles(body: any) {
    const roleId = body.role_id;
    if (!roleId) {
      throw new BadRequestException('role ID is required');
    }
    // 1. Get all side_menu_id for this role
    const sideMenuIds = await this.sideMenuMapppingRepository.findBy({ role_id: roleId });
    const menuIds = sideMenuIds.map((s) => s.side_menu_id);

    // 2. Get menus
    const menus = await this.sideMenuRepository.findBy({ id: In(menuIds) });

    // 3. Build tree with subMenus + permissions
    const menuTree = await Promise.all(
      menus.map(async (menu) => {
        const subMenus = await this.subSideMenuRepository.findBy({ menu_id: menu.id });

        const subMenusWithPermissions = await Promise.all(
          subMenus.map(async (sm) => {
            const permissions = await this.subMenuPermRepository.findBy({
              sub_menu_id: sm.id,
            });

            return {
              id: sm.id,
              name: sm.name,
              link: sm.link,
              permissions: permissions.map((p) => ({
                id: p.id,
                name: p.name,
                status: p.status,
              })),
            };
          }),
        );

        return {
          id: menu.id,
          name: menu.name,
          subMenus: subMenusWithPermissions,
        };
      }),
    );

    return menuTree.filter((menu) => menu !== undefined);
  }
  //End get all roles with side menus


  //create User Permissions
  async createUserPermissions(body: any) {
    if (!body.permission || !Array.isArray(body.permission) || body.permission.length === 0) {
      throw new BadRequestException('Please assign Side Menu Permissions to the user');
    }

    const user = await this.usersRepository.findOneBy({ id: body.user_id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingPerms = await this.permissionRepository.findBy({ user_id: body.user_id });
    if (existingPerms.length > 0) {
      await this.permissionRepository.remove(existingPerms);
    }
    const userPermissions = body.permission.map((perm: any) =>
      this.permissionRepository.create({
        user_id: body.user_id,
        menu_id: perm.menu_id,
        sub_menu_id: perm.sub_menu_id,
        module_permission: Array.isArray(perm.permission_id)
          ? perm.permission_id
          : [perm.permission_id],
      }),
    );
    await this.permissionRepository.save(userPermissions);
    return { message: 'Permissions assigned to user successfully' };
  }
  //end create User Permissions

  //get All Users 
  async getAllUsers(company: number) {
    const branches = await this.userCompanyMap.find({ where: { company_id: company } })
    const users = Promise.all(branches.map(async (b) => {
      const user = await this.usersRepository.createQueryBuilder('u')
        .innerJoin('user_company_mapping', 'ucm', 'u.id = ucm.user_id')
        .innerJoin('user_role_mapping', 'urm', 'u.id = urm.user_id')
        .innerJoin('roles', 'r', 'urm.roll_id = r.id')
        .select([
          'u.id AS id',
          'u.name AS name',
          'u.email AS email',
          'u.image AS image',
          'u.status AS status',
          'u.phone AS phone',
          'u.address AS address',
          "r.id AS role_id",
          'r.role_name AS role',
        ])
        .where('ucm.company_id = :companyId', { companyId: company })
        .andWhere('u.id = :userId', { userId: b.user_id })
        .getRawOne();

      const userBranch = Promise.all((b.branch_id || []).map(async (bid) => {
        const br = await this.branches.findOne({ where: { id: bid }, select: { id: true, branch_name: true } });
        return br
      }))
      return { ...user, branch: await userBranch }
    }))
    return users
  }
  //end get All Users 






  async getRoles() {
    const roles = await this.usersRoles.find({ where: { status: 1, id: Not(In([1, 2])), } });
    const rolesWithMapping = await Promise.all(roles.map(async (role) => {
      const mappings = await this.sideMenuMapppingRepository.createQueryBuilder('srm')
        .innerJoin('side_menus', 'sm', 'srm.side_menu_id = sm.id')
        .select(['sm.id as id', 'sm.name as name'])
        .where('srm.role_id = :roleId', { roleId: role.id })
        .getRawMany();
      return {
        ...role,
        mappings
      };
    }));
    return rolesWithMapping;
  }





  async getUserPermissions(userId: number, roleId: number) {
    // Fetch user
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Admin or superadmin bypass
    if (roleId === 1 || roleId === 2) {
      return { success: true, data: 'Admin has all permissions' };
    }

    // ✅ Step 1: Get menus assigned to this role
    const roleMenus = await this.sideMenuMapppingRepository.find({
      where: { role_id: roleId, status: 1 },
    });
    const sideMenuIds = roleMenus.map((r) => r.side_menu_id);

    // ✅ Step 2: Fetch all side menus assigned to the role
    const allMenus = await this.sideMenuRepository.find({
      where: { id: In(sideMenuIds), status: 1 },
    });

    // ✅ Step 3: Fetch user-specific saved permissions
    const userPermissions = await this.permissionRepository.find({
      where: { user_id: userId },
    });

    // ✅ Step 4: Build menu → submenu → permissions tree
    const menuTrees = await Promise.all(
      allMenus.map(async (menu) => {
        // Get all submenus under this menu
        const subMenus = await this.subSideMenuRepository.find({
          where: { menu_id: menu.id, status: 1 },
        });

        // For each submenu, get its permissions
        const subMenusWithPerms = await Promise.all(
          subMenus.map(async (sm) => {
            const perms = await this.subMenuPermRepository.find({
              where: { sub_menu_id: sm.id, status: 1 },
            });

            // Map permissions and check if user has them
            const permissions = perms.map((p) => {
              const userHas = userPermissions.some(
                (up) =>
                  up.menu_id === menu.id &&
                  up.sub_menu_id === sm.id &&
                  up.module_permission.includes(p.name),
              );
              return {
                id: p.id,
                name: p.name,
                isChecked: userHas,
              };
            });

            return {
              id: sm.id,
              name: sm.name,
              link: sm.link,
              permissions,
            };
          }),
        );

        return {
          id: menu.id,
          name: menu.name,
          key_name: menu.key_name ?? 'Others',
          subMenus: subMenusWithPerms,
        };
      }),
    );

    // ✅ Step 5: Return formatted response
    return { success: true, data: menuTrees };
  }






  async roleAndUser(userId: number, roleId: number) {
    let userPerms: any[] = [];
    let allMenus: any[] = [];
    userPerms = await this.permissionRepository.find({
      where: { user_id: userId },
    });

    const menuIds = [...new Set(userPerms.map((p) => p.menu_id))];

    allMenus = await this.sideMenuRepository.find({
      where: { id: In(menuIds) },
      order: { periority: 'ASC' },
    });

    // 🧩 Build Menu Tree
    const menuTrees = await Promise.all(
      allMenus.map(async (menu) => {
        const subMenus = await this.subSideMenuRepository.find({
          where: { menu_id: menu.id },
        });
        const subMenusWithPerms = subMenus.map((sm) => {
          const permRecord = userPerms.find(
            (p) => p.sub_menu_id === sm.id && p.menu_id === menu.id,
          );
          return {
            id: sm.id,
            name: sm.name,
            link: sm.link,
            permissions: permRecord?.module_permission || [],
          };
        });

        return {
          id: menu.id,
          name: menu.name,
          key_name: menu.key_name ?? 'Others',
          subMenus: subMenusWithPerms,
        };
      }),
    );
    return { menuTrees, userPerms };

  }

}
