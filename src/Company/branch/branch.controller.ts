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
    create(@Body() dto: CreateBranchDto, @Req() req: Request) {
        const userId = (req as any).user.id;
        return this.branchService.create(dto, userId);
    }

    @Get('list')
    findAll(@Req() req: Request) {
        const userId = (req as any).user.id;
        return this.branchService.findAll(userId);
    }

    @Get('findby/:id')
    findOne(@Param('id') id: number) {
        return this.branchService.findOne(id);
    }

    @Put('updateby/:id')
    update(@Param('id') id: number, @Body() dto: UpdateBranchDto, @Req() req: Request) {
        const userId = (req as any).user.id;
        return this.branchService.update(id, dto, userId);
    }

    // Soft delete
    @Delete('delete/:id')
    remove(@Param('id') id: number, @Body('updated_by') updatedBy: number) {
        return this.branchService.remove(id, updatedBy);
    }
}
