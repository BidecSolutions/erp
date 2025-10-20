import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, BeforeInsert } from 'typeorm';

@Entity('attribute_values')
export class AttributeValue {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: string

    @Column()
    attribute_id: number;

    @Column()
    branch_id: number;

    @Column()
    company_id: number;

    @Column({ nullable: true })
    created_by: number;

    @Column({ nullable: true })
    updated_by: number;

    @Column({ type: 'date', nullable: true })
    created_at: string;

    @Column({ type: 'date', nullable: true })
    updated_at: string;

    @Column({ type: "int", default: 1 })
    status: number;

    @BeforeInsert()
    setDefaults() {
        const now = new Date();
        this.created_at = now.toISOString().split('T')[0];
        this.updated_at = now.toISOString().split('T')[0];
    }
}