import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';
import { AbstractBaseEntity } from '../AbstractEntity';

@Entity('wallets')
export class Wallet extends AbstractBaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
