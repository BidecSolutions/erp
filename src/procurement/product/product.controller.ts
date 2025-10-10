import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseInterceptors, UploadedFiles, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { validate, validateOrReject, ValidationError } from 'class-validator';

@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get('create')
  fetch() {
    return this.productService.create();
  }
  @Post('store')
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: any, 
    @Req() req: Request,
  ) {
    if (dto.variants && typeof dto.variants === 'string') {
      try {
        dto.variants = JSON.parse(dto.variants);
      } catch (e) {
        throw new BadRequestException('Invalid JSON format for variants');
      }
    }
    const transformedDto = plainToInstance(CreateProductDto, dto);
    await validateOrReject(transformedDto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    }).catch((errors: ValidationError[]) => {
      const collectMessages = (errs: ValidationError[]): string[] => {
        const messages: string[] = [];
        for (const err of errs) {
          if (err.constraints) {
            messages.push(...Object.values(err.constraints));
          }
          if (err.children?.length) {
            messages.push(...collectMessages(err.children));
          }
        }
        return messages;
      };

      const messages = collectMessages(errors);
      throw new BadRequestException(messages.length ? messages : 'Validation failed');
    });
    const imagePaths = files?.map((file) => `/uploads/products/${file.filename}`) || [];
    const companyId = req["user"].company_id;
    const userId = req["user"].user.id;
    return this.productService.store(transformedDto, imagePaths, companyId, userId);
  }

  @Get('list')
  findAll(@Req() req: Request) {
    const companyId = req["user"].company_id;
    return this.productService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string ,@Req() req: Request) {
        const companyId = req["user"].company_id;
    return this.productService.findOne(+id ,companyId);
  }

@Patch(':id')
@UseInterceptors(FilesInterceptor('images'))
async update(
  @Param('id', ParseIntPipe) id: number,
  @UploadedFiles() files: Express.Multer.File[],
  @Body() body: any, 
  @Req() req: Request,
) {
  try {
    if (body.variants && typeof body.variants === 'string') {
      try {
        body.variants = JSON.parse(body.variants);
      } catch (e) {
        throw new BadRequestException('Invalid JSON in variants');
      }
    }
    const dto = plainToInstance(CreateProductDto, body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.map(e => Object.values(e.constraints || {})).flat());
    }
    const imagePaths = files?.map((f) => `/uploads/products/${f.filename}`) || [];
    const companyId = req['user'].company_id;
    const userId = req['user'].user.id;

    return this.productService.update(Number(id), dto, imagePaths, companyId, userId);
  } catch (error) {
    throw new BadRequestException(error.message || 'Failed to update product');
  }
}

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.productService.statusUpdate(id);
  }
}
