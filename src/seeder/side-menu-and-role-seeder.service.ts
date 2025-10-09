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

            //setup
            {
                id: 1,
                name: "Company",
                key_name: "Setup",
                periority: 1
            },

            {
                id: 2,
                name: "Branches",
                key_name: "Setup",
                periority: 2
            },

            {
                id: 3,
                name: "Department",
                key_name: "Setup",
                periority: 5
            },

            {
                id: 4,
                name: "Designation",
                key_name: "Setup",
                periority: 6
            },

            {
                id: 5,
                name: "Allowance",
                key_name: "Setup",
                periority: 7
            },

            {
                id: 6,
                name: "Annual Leave",
                key_name: "Setup",
                periority: 8
            },

            {
                id: 7,
                name: "Leave Type",
                key_name: "Setup",
                periority: 9
            },

            {
                id: 8,
                name: "Shift",
                key_name: "Setup",
                periority: 10
            },

            //HRM

            {
                id: 9,
                name: "Employees",
                key_name: "HRM",
                periority: 20
            },


            //Setup

            {
                id: 10,
                name: "Users",
                key_name: "Setup",
                periority: 3
            },

            {
                id: 11,
                name: "Customers",
                key_name: "Setup",
                periority: 4
            },

            {
                id: 12,
                name: "Suppliers",
                key_name: "Setup",
                periority: 5
            },

            {
                id: 13,
                name: "Products",
                key_name: "Setup",
                periority: 10
            },

            {
                id: 14,
                name: "Roles",
                key_name: "Setup",
                periority: 3
            },

            {
                id: 15,
                name: "Side Menus",
                key_name: "Setup",
                periority: 11
            },

        ];

        const subSideMenu: Partial<subSideMenus>[] = [
            //company Sub Menus
            {
                id: 1,
                name: "Register new Company",
                menu_id: 1,
                link: "register-company"
            },
            //branch

            {
                id: 2,
                name: "Add New Brach",
                menu_id: 2,
                link: "register-branch"
            },

            //department

            {
                id: 3,
                name: "Create Department",
                menu_id: 3,
                link: "create-department"
            },


            //Designation

            {
                id: 4,
                name: "Add Designation",
                menu_id: 4,
                link: "add-designation"
            },


            //Allowances    
            {
                id: 5,
                name: "Add Allownace",
                menu_id: 5,
                link: "employees-allowances"
            },



            //Annual Leave    
            {
                id: 6,
                name: "Add Annual Leaves",
                menu_id: 6,
                link: "add-annual-leave"
            },

            //Leave Types    
            {
                id: 7,
                name: "Add Leave Types",
                menu_id: 7,
                link: "add-leave-types"
            },

            //Shift    
            {
                id: 8,
                name: "Employees Shift",
                menu_id: 8,
                link: "create-shifts"
            },

            //Employees

            {
                id: 9,
                name: "Add New Employees",
                menu_id: 9,
                link: "add-new-employees"
            },


            //users

            {
                id: 10,
                name: "Add New Users",
                menu_id: 10,
                link: "add-new-user"
            },

            {
                id: 11,
                name: "User Premissions",
                menu_id: 10,
                link: "user-premissions"
            },

            //customers
            {
                id: 12,
                name: "Add Customers Category",
                menu_id: 11,
                link: "add-customer-category"
            },

            {
                id: 13,
                name: "Add New Customers",
                menu_id: 11,
                link: "add-customer"
            },

            //supplier
            {
                id: 14,
                name: "Add Supplier Category",
                menu_id: 12,
                link: "add-supplier-category"
            },

            {
                id: 15,
                name: "Add New Supplier",
                menu_id: 12,
                link: "add-supplier"
            },


            //product
            {
                id: 16,
                name: "Add Product Variant",
                menu_id: 13,
                link: "add-product-variant"
            },

            {
                id: 17,
                name: "Add Product UOM",
                menu_id: 13,
                link: "add-product-UOM"
            },

            {
                id: 18,
                name: "Add Product Brand",
                menu_id: 13,
                link: "add-product-brand"
            },

            {
                id: 19,
                name: "Add Product Warranty",
                menu_id: 13,
                link: "add-product-warranty"
            },
            {
                id: 20,
                name: "Add Supplier Category",
                menu_id: 13,
                link: "add-supplier-category"
            },

            {
                id: 21,
                name: "Add New Product",
                menu_id: 13,
                link: "add-new-product"
            },
            //roles 

            {
                id: 22,
                name: "Add Role & Permission",
                menu_id: 14,
                link: "add-roles-permission"
            },


            {
                id: 23,
                name: "Create Side Menus",
                menu_id: 15,
                link: "add-side-menus"
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


            //Side Menus
            {
                id: 28,
                name: "Create",
                sub_menu_id: 23,
            },

            {
                id: 29,
                name: "Update",
                sub_menu_id: 23,
            },
            {
                id: 30,
                name: "Delete",
                sub_menu_id: 23,
            },


        ];
        await this.sideMenuRepo.save(sideMenu);
        await this.subSideMenuRepo.save(subSideMenu);
        await this.subMenuPermRepository.save(subMenuPermRepository);
    }
}
