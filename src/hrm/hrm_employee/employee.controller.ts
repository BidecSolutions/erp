import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cv', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/employees',
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
          },
        }),
      },
    ),
  )
  create(
    @Body() dto: CreateEmployeeDto,
    @UploadedFiles() files: { cv?: Express.Multer.File[]; photo?: Express.Multer.File[] },
  ) {
    return this.employeeService.create(dto, files);
  }

 @Get('list')
findAll(@Query('status') status?: string) {
  // 🔹 query param se status ko number me convert kar rahe
  const filterStatus = status !== undefined ? Number(status) : undefined;
  return this.employeeService.findAll(filterStatus);
}

  @Get(':id/get')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.findOne(id);
  }

  @Put(':id/update')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cv', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/employees',
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
          },
        }),
      },
    ),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
    @UploadedFiles() files: { cv?: Express.Multer.File[]; photo?: Express.Multer.File[] },
  ) {
    return this.employeeService.update(id, dto, files);
  }

  @Delete(':id/delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.remove(id);
  }

  @Get('toogleStatus/:id')
    statusChange(@Param('id', ParseIntPipe) id: number){
      return this.employeeService.statusUpdate(id);
    }
  
}
