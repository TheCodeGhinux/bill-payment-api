import dataSource from "../db/data-source";
import { Wallet } from "../db/entities/Wallet.entity";


const walletRepo = dataSource.getRepository(Wallet);

export const generateAccountNumber = async (): Promise<string> => {
  let accountNumber: string;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 7-digit number
    const randomDigits = Math.floor(Math.random() * 10000000);
    accountNumber = '937' + randomDigits.toString().padStart(7, '0');

    // Check if the account number is unique in the database
    const existingAccount = await walletRepo.findOneBy({
      account_number: accountNumber,
    });
    isUnique = !existingAccount;
  }

  return accountNumber;
};
