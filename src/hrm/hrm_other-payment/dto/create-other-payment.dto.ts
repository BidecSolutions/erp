// import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
// import { Type } from 'class-transformer';

// export class CreateOtherPaymentDto {
//   @IsString()
//   @IsNotEmpty({ message: 'Title is required' })
//   title: string;

//   @IsEnum(['fixed', 'percentage'], { message: 'Type must be fixed or percentage' })
//   type: 'fixed' | 'percentage';

//   @IsNumber({}, { message: 'Amount must be a number' })
//   @Type(() => Number)
//   amount: number;
// }
