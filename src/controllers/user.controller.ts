import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../helpers/user.helper';
import { BadRequestError, NotFoundError } from '../middlewares';
import dataSource from '../db/data-source';
import { User } from '../db/entities/User.entity';
import { ResponseHandler } from '../utils';
import { validate as isValidUUID } from 'uuid';

const userRepository = dataSource.getRepository(User);

export const findUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqUser = req?.['user'];
    const userId = reqUser.userId;

    const user = await getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return ResponseHandler.success(res, user, 200, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const findUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqUser = req?.['user'];
    const userId = req.params.id;

    if (!isValidUUID(userId)) {
      throw new BadRequestError(
        'Invalid user ID format. Must be a valid UUID.'
      );
    }

    if (!userId) {
      throw new BadRequestError('Please provide user ID in params');
    }

    const user = await getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return ResponseHandler.success(res, user, 200, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const { id } = req.params;
    const reqUser = req?.['user'];
    const userId = reqUser.userId;
    const updatedData = req.body;

    if (updatedData.password) {
      throw new BadRequestError('Password update is not allowed');
    }

    // Fetch the user from the database
    const user = await getUserById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Update user data with the provided fields, keeping the existing values for any missing fields
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key]) {
        // Dynamically update fields if they are provided
        user[key] = updatedData[key];
      }
    });

    // Save the updated user in the database
    await userRepository.save(user);
    const userData = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };
    // Send a success response
    return ResponseHandler.success(
      res,
      userData,
      200,
      'User updated successfully'
    );
  } catch (error) {
    // Pass any error to the error handler middleware
    next(error);
  }
};
