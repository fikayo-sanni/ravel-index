import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('snapshot')
export class SnapshotEntity {
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
