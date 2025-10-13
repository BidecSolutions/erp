// src/Seeders/expense-category-seeder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/entities/role.entity';
import { userRoleMapping } from 'src/entities/user-role-mapping.entity';
import { sidemunuRolesMapping } from 'src/entities/role-side-menu-mapping.entity';
@Injectable()
export class userRoles {

    constructor(
        @InjectRepository(Role)
        private readonly userRepo: Repository<Role>,

        @InjectRepository(userRoleMapping)
        private readonly rolemap: Repository<userRoleMapping>,

        @InjectRepository(sidemunuRolesMapping)
        private readonly sideMenuRoleMapping: Repository<sidemunuRolesMapping>,

    ) { }

    async run() {
        const role = await this.userRepo.find();
        if (role.length > 0) {
            return;
        }
        await this.sideMenuRoleMapping.clear();
        await this.userRepo.clear();
        const menuRoles: Partial<sidemunuRolesMapping>[] = [];
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10);

        const seedData = [
            {
                id: 1,
                role_name: 'Super Admin',
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],
                menuRoles: [

                ],
            },
            {
                id: 2,
                role_name: 'Admin ',
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],
                menuRoles: [

                ],
            },
        ];


        await this.userRepo.save(seedData);
        const allMenuRoles = seedData.flatMap(r => r.menuRoles ?? []);
        await this.sideMenuRoleMapping.save(allMenuRoles)

        //User Role Mapping
        const roleMap: Partial<userRoleMapping>[] = [
            {
                user_id: 1,
                roll_id: 1,
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],
            },
        ];

        await this.rolemap.save(roleMap);
    }
}
