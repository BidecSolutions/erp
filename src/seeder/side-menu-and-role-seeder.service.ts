// src/Seeders/expense-category-seeder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { sideMenus } from 'src/entities/side-menu.entity';
import { subSideMenus } from 'src/entities/sub-side-menu.entity';
import { subSideMenuPermission } from 'src/entities/sub-side-menu-permission.entity';
@Injectable()
export class sideMenuAndRoleSeederService {

    constructor(

        @InjectRepository(sideMenus)
        private readonly sideMenuRepo: Repository<sideMenus>,

        @InjectRepository(subSideMenus)
        private readonly subSideMenuRepo: Repository<subSideMenus>,

        @InjectRepository(subSideMenuPermission)
        private subMenuPermRepository: Repository<subSideMenuPermission>,
    ) { }

    async run() {
        await this.sideMenuRepo.clear();
        await this.subSideMenuRepo.clear();
        await this.subMenuPermRepository.clear();

        const sideMenu: Partial<sideMenus>[] = [
            {
                id: 1,
                name: "Company",
            },

            {
                id: 2,
                name: "Branch"
            },

            {
                id: 3,
                name: "Customer"
            },
        ];

        const subSideMenu: Partial<subSideMenus>[] = [
            //company Sub Menus
            {
                id: 1,
                name: "Register new Company",
                menu_id: 1,
                link: "auth/login"
            },

            //branch Sub menus
            {
                id: 2,
                name: "Add new Branch",
                menu_id: 2,
                link: "auth/login"
            },

            {
                id: 3,
                name: "Add new Branch",
                menu_id: 3,
                link: "auth/login"
            },


        ];

        const subMenuPermRepository: Partial<subSideMenuPermission>[] = [
            //company Registration
            {
                id: 1,
                name: "Create",
                sub_menu_id: 1,
            },

            {
                id: 2,
                name: "Update",
                sub_menu_id: 1,
            },
            {
                id: 3,
                name: "Delete",
                sub_menu_id: 1,
            },
            //Branch Registration
            {
                id: 4,
                name: "Create",
                sub_menu_id: 2,
            },

            {
                id: 5,
                name: "Update",
                sub_menu_id: 2,
            },
            {
                id: 6,
                name: "Delete",
                sub_menu_id: 2,
            },


            {
                id: 7,
                name: "Create",
                sub_menu_id: 3,
            },

            {
                id: 8,
                name: "Update",
                sub_menu_id: 3,
            },
            {
                id: 9,
                name: "Delete",
                sub_menu_id: 3,
            },
        ];
        await this.sideMenuRepo.save(sideMenu);
        await this.subSideMenuRepo.save(subSideMenu);
        await this.subMenuPermRepository.save(subMenuPermRepository);
    }
}
