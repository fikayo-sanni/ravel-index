import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('view')
export class ViewEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  tenantId!: string;
  @Column()
  name!: string;
  @Column()
  version!: number;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
