import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';
import { Wallet } from './Wallet';
import { AbstractBaseEntity } from '../AbstractEntity';

export type TransactionType = 'fund' | 'deduct';
export type TransactionStatus = 'success' | 'failed';

@Entity('transactions')
export class Transaction extends AbstractBaseEntity {
  @Column({ type: 'enum', enum: ['fund', 'deduct'] })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['success', 'failed'], default: 'success' })
  status: TransactionStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  wallet: Wallet;

  @CreateDateColumn()
  createdAt: Date;
}
