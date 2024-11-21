import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { AbstractBaseEntity } from '../AbstractEntity';
import { Wallet } from './Wallet.entity';
import { BillPayment } from './BillPayment.entity';
import { Transaction } from './Transaction.entity';
// import { Wallet } from './Wallet';
// import { BillPayment } from './BillPayment';

export enum UserType {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User extends AbstractBaseEntity {
  @Column({ type: 'varchar', length: 255 })
  first_name: string;

  @Column({ type: 'varchar', length: 255 })
  last_name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ enum: UserType, default: UserType.USER })
  role: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;

  @OneToMany(() => BillPayment, (billPayment) => billPayment.user)
  billPayments: BillPayment[];

  @OneToMany(() => Transaction, (transactions) => transactions.user)
  transactions: BillPayment[];
}

// @Entity()
// export class User  extends AbstractBaseEntity {

//   @Column()
//   firstName: string;

//   @Column()
//   lastName: string;

//   @Column()
//   age: number;
// }
