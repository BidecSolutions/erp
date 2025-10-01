import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Product } from 'src/procurement/product/entities/product.entity';

@Entity('warranties')
export class Warranty {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    warranty_type: string;

    @Column()
    duration: string;

    @Column({ name: 'status',  default: 1 })
    status: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    created_by: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    updated_by: string;
}
