import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateSupplierDto {
    @IsNotEmpty()
    company_id: number;
    @IsNotEmpty()
    supplier_category_id: number;
    @IsNotEmpty()
    supplier_code: string;
    @IsNotEmpty()
    supplier_name: string;
    @IsOptional()
    contact_person?: string;
    @IsOptional()
    designation?: string;
    @IsOptional()
    email?: string;
    @IsOptional()
    phone?: string;
    @IsOptional()
    mobile?: string;
    @IsOptional()
    website?: string;
    @IsOptional()
    address_line1?: string;
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
