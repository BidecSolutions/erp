import { IsString, Length } from "class-validator";

export class CreatePaysliptypeDto{
    @IsString({message: 'Payslipe Type name must be a string'})
    name: string
}