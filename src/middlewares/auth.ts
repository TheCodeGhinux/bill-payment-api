import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ResponseHandler } from '../utils';
import { ForbiddenError, UnauthorizedError } from './errorhandler';

dotenv.config();

const secretKey = process.env.JWT_SECRET;

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const tokenFromCookie = req.cookies?.access_token;

  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (tokenFromCookie) {
    token = tokenFromCookie;
  } else {
    throw new UnauthorizedError('Authorization token missing');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      throw new ForbiddenError('Invalid or expired token');
    }

    req.user = decoded as JwtPayload;

    next();
  });
};
