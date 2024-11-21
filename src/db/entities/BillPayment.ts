import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Wallet } from './Wallet';
import { AbstractBaseEntity } from '../AbstractEntity';

export type BillStatus = 'success' | 'failed';
export type BillType = 'airtime' | 'electricity' | 'data';

@Entity('bill_payments')
export class BillPayment extends AbstractBaseEntity {
  @Column({ type: 'enum', enum: ['airtime', 'electricity', 'data'] })
  billType: BillType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference: string;

  @Column({ type: 'enum', enum: ['success', 'failed'], default: 'success' })
  status: BillStatus;

  @ManyToOne(() => User, (user) => user.billPayments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  wallet: Wallet;
}
