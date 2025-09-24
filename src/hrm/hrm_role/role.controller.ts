// import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
// import { RoleService } from './role.service';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { UpdateRoleDto } from './dto/update-role.dto';

// @Controller('roles')
// export class RoleController {
//   constructor(private readonly roleService: RoleService) {}

//   @Get('get-roles')
//   findAll() {
//     return this.roleService.findAll();
//   }

//   @Get(':id/get-role')
//   findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.roleService.findOne(id);
//   }

//   @Post('create-role')
//   create(@Body() dto: CreateRoleDto) {
//     return this.roleService.create(dto);
//   }

//   @Put(':id/update-role')
//   update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
//     return this.roleService.update(id, dto);
//   }

//   @Delete(':id/delete-role')
//   remove(@Param('id', ParseIntPipe) id: number) {
//     return this.roleService.remove(id);
//   }
// }
