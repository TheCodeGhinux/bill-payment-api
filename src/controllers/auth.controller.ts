import e, { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dataSource from '../db/data-source';
import { User } from '../db/entities/User.entity';
import { ResponseHandler } from '../utils';
import { BadRequestError, NotFoundError } from '../middlewares';
import { fieldValidation } from '../helpers/user.helper';
import { createWallet } from '../services/wallet.service';

const userRepository = dataSource.getRepository(User);

const jwtSecret = process.env.JWT_SECRET;
const salt = process.env.SALT || 10;

// Register Function
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password: plainPassword, first_name, last_name } = req.body;

    // Validate inputs (assuming fieldValidation is implemented)
    const requiredFields = ['email', 'password', 'first_name', 'last_name'];
    const fieldDisplayNames = {
      email: 'Email',
      password: 'Password',
      first_name: 'First Name',
      last_name: 'Last Name',
    };

    fieldValidation(requiredFields, fieldDisplayNames, req.body);

    // Check if user already exists
    const userRepo = dataSource.getRepository(User);
    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      plainPassword,
      parseInt(salt.toString())
    );

    // Create a user and wallet within a transaction
    await dataSource.transaction(async (manager) => {
      // Create the user
      const newUser = manager.create(User, {
        email,
        password: hashedPassword,
        first_name,
        last_name,
      });
      const savedUser = await manager.save(newUser);

      // Create a wallet for the user
      await createWallet(savedUser.id, manager);

      // Exclude sensitive info before returning
      const { password, ...userDataRes } = savedUser;

      ResponseHandler.success(
        res,
        userDataRes,
        201,
        'User registered successfully'
      );
    });
  } catch (error) {
    next(error);
  }
};

// Login Function
export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password: plainPassword } = req.body;

    const requiredFields = ['email', 'password'];

    const fieldDisplayNames = {
      email: 'Email',
      password: 'Password',
    };

    fieldValidation(requiredFields, fieldDisplayNames, req.body);

    // Check if the user exists
    const user = await userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Invalid email or password');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '2d' });

    const { password, ...userDataRes } = user;

    return ResponseHandler.success(
      res,
      { token, userDataRes },
      200,
      'Login successful'
    );
  } catch (error) {
    // console.error(error);
    next(error);
  }
}
