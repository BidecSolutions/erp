// src/Seeders/expense-category-seeder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/entities/role.entity';
import { userRoleMapping } from 'src/entities/user-role-mapping.entity';
@Injectable()
export class userRoles {

    constructor(
        @InjectRepository(Role)
        private readonly userRepo: Repository<Role>,

        @InjectRepository(userRoleMapping)
        private readonly rolemap: Repository<userRoleMapping>,

    ) { }

    async run() {
        const existingUsers = await this.userRepo.find();
        if (existingUsers.length > 0) {
            return;
        }
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10);
        const seedData: Partial<Role>[] = [
            {
                role_name: 'Super Admin',
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],

            },

            {
                role_name: 'Admin ',
                created_date: formattedDate,
                created_time: now.toTimeString().split(' ')[0],
            },


        ];
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
        await this.userRepo.save(seedData);

    }
}
