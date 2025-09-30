import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Res, Req } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchController {
    constructor(private readonly branchService: BranchService) { }

    @Post('create')
    create(@Body() dto: CreateBranchDto) {
        return this.branchService.create(dto);
    }

    @Get('list')
    findAll() {
        return this.branchService.findAll();
    }

    @Get('findby/:id')
    findOne(@Param('id') id: number) {
        return this.branchService.findOne(id);
    }

    @Put('updateby/:id')
    update(@Param('id') id: number, @Body() dto: UpdateBranchDto) {
        return this.branchService.update(id, dto);
    }

    // Soft delete
    @Delete('delete/:id')
    remove(@Param('id') id: number, @Body('updated_by') updatedBy: number) {
        return this.branchService.remove(id, updatedBy);
    }
}
