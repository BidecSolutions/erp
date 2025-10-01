import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CompaniesService } from '../companies/companies.service';
import { CreateCompanyDto } from '../companies/dto/create-company.dto';
import { UpdateCompanyDto } from '../companies/dto/update-company.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Post('create')
    @UseInterceptors(
        FileInterceptor('company_logo', {
            storage: diskStorage({
                destination: 'src/uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    create(@Body() dto: CreateCompanyDto, @UploadedFile() file: Express.Multer.File) {
        if (file) dto['company_logo_path'] = file.path;
        return this.companiesService.create(dto);
    }

    @Get('list')
    findAll() {
        return this.companiesService.findAll();
    }

    @Get('findby/:id')
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(+id);
    }

    @Put('updateby/:id')
    @UseInterceptors(
        FileInterceptor('company_logo', {
            storage: diskStorage({
                destination: 'companies/uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    update(@Param('id') id: string, @Body() dto: UpdateCompanyDto, @UploadedFile() file: Express.Multer.File) {
        if (file) dto['company_logo_path'] = file.path;
        return this.companiesService.update(+id, dto);
    }

    // @Delete('delete/:id')
    // remove(@Param('id') id: string) {
    //     return this.companiesService.softDelete(+id);
    // }
}
