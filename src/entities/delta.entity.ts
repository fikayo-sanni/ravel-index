import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('delta')
export class DeltaEntity {
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
