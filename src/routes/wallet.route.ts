import express from 'express';
import {
  checkBalance,
  addFunds,
  deductFunds,
} from '../controllers/wallet.controller';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet management routes
 */

/**
 * @swagger
 * /api/v1/wallet/balance:
 *   get:
 *     summary: Get wallet balance of the authenticated user
 *     description: This endpoint allows the user to check their current wallet balance.
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   description: The current wallet balance
 *       401:
 *         description: Unauthorized access (user not authenticated)
 *       500:
 *         description: Internal server error
 */
router.get('/wallet/balance', authenticateJWT, checkBalance);

/**
 * @swagger
 * /api/v1/wallet/fund:
 *   patch:
 *     summary: Fund the wallet of the authenticated user
 *     description: This endpoint allows the user to fund their wallet by adding a specific amount.
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to be added to the wallet
 *                 example: 100
 *     responses:
 *       200:
 *         description: Wallet funded successfully
 *       400:
 *         description: Bad request (amount not provided)
 *       401:
 *         description: Unauthorized access (user not authenticated)
 *       500:
 *         description: Internal server error
 */
router.patch('/wallet/fund', authenticateJWT, addFunds);

/**
 * @swagger
 * /api/v1/wallet/deduct:
 *   patch:
 *     summary: Deduct funds from the authenticated user's wallet
 *     description: This endpoint allows the user to deduct a specified amount from their wallet.
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to be deducted from the wallet
 *                 example: 50
 *     responses:
 *       200:
 *         description: Amount deducted successfully
 *       400:
 *         description: Bad request (amount not provided)
 *       401:
 *         description: Unauthorized access (user not authenticated)
 *       500:
 *         description: Internal server error
 */
router.patch('/wallet/deduct', authenticateJWT, deductFunds);

module.exports = router;
