import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

@Entity()
export abstract class AbstractBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
