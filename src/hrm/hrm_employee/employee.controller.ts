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
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtBranchAuth } from 'src/auth/jwt-branch.guard';

@UseGuards(JwtBranchAuth)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post('create')
@UseInterceptors(
  FileFieldsInterceptor(
    [
      { name: 'cv', maxCount: 1 },
      { name: 'photo', maxCount: 1 },
      { name: 'academic_transcript', maxCount: 1 },
      { name: 'identity_card', maxCount: 2 }, // 👈 2 files allow
    ],
    {
      storage: diskStorage({
        destination: './uploads/employees',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedTypes = {
          cv: [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ],
          academic_transcript: [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ],
          photo: ['image/png', 'image/jpg', 'image/jpeg'],
          identity_card: ['image/png', 'image/jpg', 'image/jpeg'],
        };

        const fieldRules = allowedTypes[file.fieldname];
        if (fieldRules && !fieldRules.includes(file.mimetype)) {
          let message = '';
          switch (file.fieldname) {
            case 'cv':
              message = 'CV must be a PDF or DOCX file';
              break;
            case 'academic_transcript':
              message = 'Academic Transcript must be a PDF or DOCX file';
              break;
            case 'photo':
              message = 'Photo must be in PNG, JPG, or JPEG format';
              break;
            case 'identity_card':
              message = 'Identity Card must be in PNG, JPG, or JPEG format';
              break;
            default:
              message = `${file.fieldname} has an invalid file type`;
          }
          return callback(new BadRequestException(message), false);
        }

        // // Photo size check (2MB limit)
        if (file.fieldname === 'photo' && file.size > 2 * 1024 * 1024) {
          return callback(new BadRequestException('Photo must not exceed 2 MB'), false);
        }

        callback(null, true);
      },
    },
  ),
)
create(
  @Body() dto: CreateEmployeeDto,
  @UploadedFiles()
  files: {
    cv?: Express.Multer.File[];
    photo?: Express.Multer.File[];
    academic_transcript?: Express.Multer.File[];
    identity_card?: Express.Multer.File[];
  },
) {
  return this.employeeService.create(dto, files);
}

  // @Get('list')
  // findAll() {
  //   return this.employeeService.findAll();
  // }
  @Post('list')
  findAll(@Body() body:any) {
    return this.employeeService.findAll(body);
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
  { name: 'academic_transcript', maxCount: 1 },
  { name: 'identity_card', maxCount: 2 },
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

  // @Delete(':id/delete')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.employeeService.remove(id);
  // }

   @Get('toogleStatus/:id')
    statusChange(@Param('id', ParseIntPipe) id: number){
      return this.employeeService.statusUpdate(id);
    }
}
