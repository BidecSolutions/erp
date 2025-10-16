import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { Department } from "../hrm_department/department.entity";

@Entity("hrm_designations")
export class Designation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relation with Department
  @ManyToOne(() => Department, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "department_id" })
  department: Department;

  @Column({ type: "int" })
  department_id: number;

  @Column({ type: "int" })
  company_id: number;

  @Column({
    type: "int",
    comment: "0 = inactive, 1 = active",
    default: 1,
  })
  status: number;

  @Column({ name: "created_by", nullable: true })
  created_by: number;

  @Column({ name: "updated_by", nullable: true })
  updated_by: number;

  @Column({ type: "date" })
  created_at: string;

  @Column({ type: "date" })
  updated_at: string;

  @BeforeInsert()
  setDefaults() {
    const now = new Date();
    this.created_at = now.toISOString().split("T")[0];
    this.updated_at = now.toISOString().split("T")[0];
  }
}
