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


        await this.userRepo.clear();
        await this.rolemap.clear();
        await this.sideMenuRoleMapping.clear();
        const menuRoles: Partial<sidemunuRolesMapping>[] = [];
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10);

        const seedData = [
            {
                id: 1,
                role_name: 'Super Admin',
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],
            },
            {
                id: 2,
                role_name: 'Admin ',
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],
            },
            //HR Manager
            {
                id: 3,
                role_name: 'HR Manager',
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],
                // menuRoles: [
                //     { role_id: 1, side_menu_id: 2 },
                //     { role_id: 1, side_menu_id: 3 },
                // ],
            },

            // Inventory And Procurement
            {
                id: 4,
                role_name: 'Inventory & Procurement Assistant',
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],
                // menuRoles: [
                //     { role_id: 1, side_menu_id: 2 },
                //     { role_id: 1, side_menu_id: 3 },
                // ],
            },
            {
                id: 5,
                role_name: 'Inventory & Procurement Manager',
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],
                // menuRoles: [
                //     { role_id: 1, side_menu_id: 2 },
                //     { role_id: 1, side_menu_id: 3 },
                // ],
            },

            //Sales
            {
                id: 6,
                role_name: 'Sales Assistant',
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],
                // menuRoles: [
                //     { role_id: 1, side_menu_id: 2 },
                //     { role_id: 1, side_menu_id: 3 },
                // ],
            },
            {
                id: 7,
                role_name: 'Sales Manager',
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],
                // menuRoles: [
                //     { role_id: 1, side_menu_id: 2 },
                //     { role_id: 1, side_menu_id: 3 },
                // ],
            },

            //Accouts
            {
                id: 8,
                role_name: 'Accountant',
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],
                // menuRoles: [
                //     { role_id: 1, side_menu_id: 2 },
                //     { role_id: 1, side_menu_id: 3 },
                // ],
            },

            //Finance
            {
                id: 9,
                role_name: 'Finance Manager',
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

            // {
            //     user_id: 2,
            //     roll_id: 2,
            //     created_date: formattedDate,
            //     created_time: now.toTimeString().split(' ')[0],
            // },

        ];

        await this.rolemap.save(roleMap);


    }
}
