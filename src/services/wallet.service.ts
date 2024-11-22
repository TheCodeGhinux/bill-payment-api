import { EntityManager } from 'typeorm';
import { Wallet } from '../db/entities/Wallet.entity';
import { BadRequestError, NotFoundError } from '../middlewares';
import dataSource from '../db/data-source';
import { generateAccountNumber } from '../helpers/wallet.helper';

const walletRepo = dataSource.getRepository(Wallet);

/**
 * Create a wallet for a user
 */
export const createWallet = async (userId: string, manager: EntityManager) => {
  // Generate a unique account number
  const accountNumber = await generateAccountNumber();

  // Create a wallet
  const wallet = manager.create(Wallet, {
    user: { id: userId },
    balance: 0,
    account_number: accountNumber,
  });

  // Save the wallet to the database
  await manager.save(wallet);
};

/**
 * Get wallet balance
 */
export const getWalletBalance = async (userId: string) => {
  const wallet = await walletRepo.findOne({
    where: { user: { id: userId } },
    relations: ['user'],
  });

  if (!wallet) {
    throw new BadRequestError('Wallet not found');
  }

  return wallet.balance;
};
/**
 * Fund wallet
 */
export const fundWallet = async (accountNumber: string, amount: number) => {
  if (amount <= 0) {
    throw new BadRequestError('Amount must be greater than zero');
  }

  await dataSource.transaction(async (manager: EntityManager) => {
    // Find the wallet using the account number
    const wallet = await manager.findOneBy(Wallet, {
      account_number: accountNumber,
    });
    if (!wallet) {
      throw new NotFoundError('Wallet not found');
    }

    // Update the wallet balance
    wallet.balance += amount;
    await manager.save(wallet);
  });
};

/**
 * Deduct wallet balance
 */
export const deductWalletBalance = async (userId: string, amount: number) => {
  if (amount <= 0) {
    throw new BadRequestError('Amount must be greater than zero');
  }

  await dataSource.transaction(async (manager: EntityManager) => {
    const wallet = await manager.findOneBy(Wallet, { user: { id: userId } });
    if (!wallet) {
      throw new NotFoundError('Wallet not found');
    }

    if (wallet.balance < amount) {
      throw new BadRequestError('Insufficient balance');
    }

    wallet.balance -= amount;
    await manager.save(wallet);
  });
};
