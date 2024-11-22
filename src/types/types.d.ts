import * as express from 'express';
import { JwtPayload } from '../middlewares/auth';
// import { JwtPayload } from '../middlewares/auth';

export interface UserPayload {
  userId: string;
  email: string;
  role: string;
}



declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
