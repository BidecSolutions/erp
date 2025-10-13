import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('module_types')
export class ModuleType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    module_type: string;

    @Column({ name: 'module_code', type: 'varchar', length: 50, unique: true })
    module_code: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'status', type: 'tinyint', default: 1 })
    status: number;


    @Column({ nullable: true })
    created_by: number;

    @Column({ nullable: true })
    updated_by: number;
    
    @Column({ type: 'date', nullable: true })
    created_at: string;

    @Column({ type: 'date', nullable: true })
    updated_at: string;

    @BeforeInsert()
    setDefaults() {
        const now = new Date();
        this.created_at = now.toISOString().split('T')[0];
        this.updated_at = now.toISOString().split('T')[0];
    }

}
