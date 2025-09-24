// import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
// import { BranchService } from './branch.service';
// import { CreateBranchDto } from './dto/create-branch.dto';
// import { UpdateBranchDto } from './dto/update-branch.dto';

// @Controller('branches')
// export class BranchController {
//   constructor(private readonly branchService: BranchService) {}

//   @Get('get-branches')
//   findAll() {
//     return this.branchService.findAll();
//   }

//   @Get(':id/get-branch')
//   findOne(@Param('id', ParseIntPipe) id: number) {
//     return this.branchService.findOne(id);
//   }

//   @Post('create-branch')
//   create(@Body() dto: CreateBranchDto) {
//     return this.branchService.create(dto);
//   }

//   @Put(':id/update-branch')
//   update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBranchDto) {
//     return this.branchService.update(id, dto);
//   }

//   @Delete(':id/delete-branch')
//   remove(@Param('id', ParseIntPipe) id: number) {
//     return this.branchService.remove(id);
//   }
// }
