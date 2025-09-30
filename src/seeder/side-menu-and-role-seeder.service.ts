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
                name: "Branches",
            },

            {
                id: 3,
                name: "Department",
            },

            {
                id: 4,
                name: "Designation",
            },

            {
                id: 5,
                name: "Allowance",
            },

            {
                id: 6,
                name: "Annual Leave",
            },

            {
                id: 7,
                name: "Leave Type",
            },

            {
                id: 8,
                name: "Shift",
            },

            {
                id: 9,
                name: "Employees",
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
            //branch

            {
                id: 2,
                name: "Add New Brach",
                menu_id: 2,
                link: "auth/login"
            },

            //department

            {
                id: 3,
                name: "Create Department",
                menu_id: 2,
                link: "auth/login"
            },


            //Designation

            {
                id: 4,
                name: "Add Designation",
                menu_id: 4,
                link: "auth/login"
            },


            //Allowances    
            {
                id: 5,
                name: "Add Allownace",
                menu_id: 5,
                link: "auth/login"
            },



            //Annual Leave    
            {
                id: 6,
                name: "Add Annually Leaves",
                menu_id: 6,
                link: "auth/login"
            },

            //Leave Types    
            {
                id: 7,
                name: "Add Leave Types",
                menu_id: 7,
                link: "auth/login"
            },

            //Shift    
            {
                id: 8,
                name: "Employees Shift",
                menu_id: 8,
                link: "auth/login"
            },

            //Employees

            {
                id: 9,
                name: "Add New Employees",
                menu_id: 9,
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

            //branches

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
            // Department
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

            //designation
            {
                id: 10,
                name: "Create",
                sub_menu_id: 4,
            },

            {
                id: 11,
                name: "Update",
                sub_menu_id: 4,
            },
            {
                id: 12,
                name: "Delete",
                sub_menu_id: 4,
            },


            //Allowances
            {
                id: 13,
                name: "Create",
                sub_menu_id: 5,
            },

            {
                id: 14,
                name: "Update",
                sub_menu_id: 5,
            },
            {
                id: 15,
                name: "Delete",
                sub_menu_id: 5,
            },


            //Annual Leaves
            {
                id: 16,
                name: "Create",
                sub_menu_id: 6,
            },

            {
                id: 17,
                name: "Update",
                sub_menu_id: 6,
            },
            {
                id: 18,
                name: "Delete",
                sub_menu_id: 6,
            },

            //Leave Types
            {
                id: 19,
                name: "Create",
                sub_menu_id: 7,
            },

            {
                id: 20,
                name: "Update",
                sub_menu_id: 7,
            },
            {
                id: 21,
                name: "Delete",
                sub_menu_id: 7,
            },


            //Shift
            {
                id: 22,
                name: "Create",
                sub_menu_id: 8,
            },

            {
                id: 23,
                name: "Update",
                sub_menu_id: 8,
            },
            {
                id: 24,
                name: "Delete",
                sub_menu_id: 8,
            },


            //Employees
            {
                id: 25,
                name: "Create",
                sub_menu_id: 9,
            },

            {
                id: 26,
                name: "Update",
                sub_menu_id: 9,
            },
            {
                id: 27,
                name: "Delete",
                sub_menu_id: 9,
            },


        ];
        await this.sideMenuRepo.save(sideMenu);
        await this.subSideMenuRepo.save(subSideMenu);
        await this.subMenuPermRepository.save(subMenuPermRepository);
    }
}
