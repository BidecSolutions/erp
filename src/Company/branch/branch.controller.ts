import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Res, Req, ParseIntPipe } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('branches')
export class BranchController {
    constructor(private readonly branchService: BranchService) { }

    @Post('create')
    create(@Body() dto: CreateBranchDto, @Req() req: Request) {
        const userId = req['user'].user.id;
        const compnayId = req['user'].company_id;
        return this.branchService.create(dto, userId, compnayId);
    }

    @Get('list')
    findAll(@Req() req: Request) {
        const userId = req['user'].user.id;
        const compnayId = req['user'].company_id;
        return this.branchService.findAll(userId, compnayId);
    }

    @Get('findby/:id')
    findOne(@Param('id') id: number) {
        return this.branchService.findOne(id);
    }

    @Put('updateby/:id')
    update(@Param('id') id: number, @Body() dto: UpdateBranchDto, @Req() req: Request) {
        const userId = req['user'].user.id;
        const compnayId = req['user'].company_id;
        return this.branchService.update(id, dto, userId, compnayId);
    }

    // Soft delete
    @Get('toggleStatus/:id')
    toggleStatus(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.branchService.toggleStatus(id);
    }

}
