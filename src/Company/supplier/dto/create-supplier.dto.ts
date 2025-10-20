import { IsEmail, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateSupplierDto {
    @IsInt({ message: 'Supplier category must be a valid integer ID' })
    @IsNotEmpty({ message: 'Supplier category is required' })
    supplier_category_id: number;

    @IsNotEmpty({ message: 'Supplier Name is required' })
    supplier_name: string;

    @IsNotEmpty({ message: "Supplier Email Address Is Required" })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: "Supplier Contact Number Is Required" })
    phone: string;

    @IsNotEmpty({ message: "Supplier Address Is Required" })
    address_line1: string;

    @IsOptional()
    contact_person?: string;
    @IsOptional()
    designation?: string;
    @IsOptional()
    mobile?: string;
    @IsOptional()
    website?: string;
    @IsOptional()
    address_line2?: string;
    @IsOptional()
    city?: string;
    @IsOptional()
    state?: string;
    @IsOptional()
    country?: string;
    @IsOptional()
    postal_code?: string;
    @IsOptional()
    payment_terms?: string;
    @IsOptional()
    credit_days?: number;
    @IsOptional()
    tax_id?: string;
    @IsOptional()
    gst_no?: string;
    @IsOptional()
    pan_no?: string;
    @IsOptional()
    opening_balance?: number;
    @IsOptional()
    balance_type?: string;
    @IsOptional()
    supplier_status?: string;
    @IsOptional()
    registration_date?: string;
    @IsOptional()
    notes?: string;
    @IsOptional()
    bank_account_no?: string;
    @IsOptional()
    bank_name?: string;
    @IsOptional()
    ifsc_code?: string;
}
