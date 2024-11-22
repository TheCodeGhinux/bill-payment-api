import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUserById } from '../../helpers/user.helper';
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../errorhandler';
// import {
//   findWalletByAccountNumber,
//   findWalletById,
//   findWalletByUserId,
// } from '../helpers/wallet.helper';

dotenv.config();

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

const adminRole = 'admin';
const secretKey = process.env.JWT_SECRET;
export const userGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const tokenFromCookie = req.cookies?.access_token;

  let token = '';

  // Check if token is available from header or cookie
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (tokenFromCookie) {
    token = tokenFromCookie;
  } else {
    throw new UnauthorizedError('Authorization token missing for user');
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.user = decoded;

    // Fetch user from the database
    const currentUser = await getUserById(decoded.userId);
    if (!currentUser) {
      throw new NotFoundError('User not found');
    }

    // Check if the request is for the logged-in user's own profile (`/users/me`)
    if (
      req.originalUrl === '/api/v1/users/me' ||
      decoded.userId === req.params.id
    ) {
      return next();
    }

    // Check if the user is an admin
    if (decoded.role === adminRole) {
      return next();
    }

    // If the user is not an admin, only allow updating their own profile
    throw new ForbiddenError(
      "You don't have permission to update this user's profile"
    );
  } catch (err) {
    next(err); // Pass any error to the next middleware
  }
};

// export const userWalletGuard = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization; // Extract authorization header
//   const identifier = req.params.identifier; // Identifier (walletId or accountNumber)
//   const tokenFromCookie = req.cookies?.access_token; // Get token from cookie

//   let token = '';

//   // Check if token is available from header or cookie
//   if (authHeader && authHeader.startsWith('Bearer ')) {
//     token = authHeader.split(' ')[1];
//   } else if (tokenFromCookie) {
//     token = tokenFromCookie;
//   } else {
//     return res
//       .status(401)
//       .json({ message: 'Authorization token missing for user' });
//   }

//   // Verify token
//   jwt.verify(token, secretKey, async (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     }

//     const user = decoded as JwtPayload; // Decode user from token
//     req.user = user;

//     // Fetch user from database using userId in the decoded token
//     const currentUser = await getUserById(user.userId);
//     if (!currentUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     let wallet: Wallet;

//     // Find wallet by identifier (walletId or accountNumber)
//     if (identifier) {
//       wallet =
//         (await findWalletById(identifier)) ||
//         (await findWalletByAccountNumber(identifier)); // Check if identifier matches walletId or accountNumber
//     }
//     if (!identifier) {
//       wallet = await findWalletByUserId(user.userId); // Default to user-specific wallet
//       if (!wallet) {
//         return res.status(404).json({ message: 'Wallet not found' });
//       }
//     }

//     // Check if user is admin or the owner of the wallet
//     if (user.role !== adminRole && wallet.user_id !== user.userId) {
//       return res
//         .status(403)
//         .json({ message: "You don't have permission to access this wallet" });
//     }

//     // Proceed to the next middleware if all checks pass
//     next();
//   });
// };
