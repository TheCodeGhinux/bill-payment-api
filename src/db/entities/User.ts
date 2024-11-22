import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { AbstractBaseEntity } from '../AbstractEntity';
import { Wallet } from './Wallet';
import { BillPayment } from './BillPayment';
import { Transaction } from './Transaction';
// import { Wallet } from './Wallet';
// import { BillPayment } from './BillPayment';

@Entity('users')
export class User extends AbstractBaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

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
