import { Request, Response, NextFunction } from 'express';

import {
  fundWallet,
  getWalletBalance,
  deductWalletBalance,
} from '../services/wallet.service';
import { ResponseHandler } from '../utils';
import { BadRequestError } from '../middlewares';

/**
 * Check wallet balance
 */
export const checkBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.['user'].userId;
    const balance = await getWalletBalance(userId);
    return ResponseHandler.success(
      res,
      { balance },
      200,
      'Wallet balance retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Fund wallet
 */
export const addFunds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountNumber, amount } = req.body;

    // Validate inputs
    if (!accountNumber || !amount) {
      throw new BadRequestError('Account number and amount are required');
    }

    await fundWallet(accountNumber, amount);

    return ResponseHandler.success(
      res,
      null,
      200,
      'Wallet funded successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Deduct wallet balance
 */
export const deductFunds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.['user'].userId;
    const { amount } = req.body;

    if (!amount) {
      throw new BadRequestError('Amount is required');
    }

    await deductWalletBalance(userId, amount);
    return ResponseHandler.success(
      res,
      null,
      200,
      'Amount deducted successfully'
    );
  } catch (error) {
    next(error);
  }
};
