import { Equal } from 'typeorm';
import dataSource from '../db/data-source';
import { User } from '../db/entities/User.entity';
import { BadRequestError, NotFoundError } from '../middlewares';

const userRepository = dataSource.getRepository(User);
export const getUserById = async (id: string): Promise<User> => {
  try {
    const user = await userRepository.findOne({ where: { id: Equal(id) } });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

export const fieldValidation = (requiredFields, fieldDisplayNames, data) => {
  // const missingFields = requiredFields.filter((field) => !req.body[field]);
  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    const errorMessage =
      missingFields.length === 1
        ? `${fieldDisplayNames[missingFields[0]]} is required`
        : `${missingFields
            .map((field) => fieldDisplayNames[field])
            .join(', ')} are required`;

    throw new BadRequestError(errorMessage);
  }
  return;
};
