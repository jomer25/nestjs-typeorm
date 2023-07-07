import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ErrorMessageDto } from './dto/error-message.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(new ErrorMessageDto('User not found'));
      }

      return user;
    } catch (error) {
      throw new NotFoundException(new ErrorMessageDto(error.message));
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updateUser = await this.findOne(id);

      if (!updateUser) {
        throw new NotFoundException(new ErrorMessageDto('User not found'));
      }

      Object.assign(updateUser, updateUserDto);
      return this.userRepository.save(updateUser);
    } catch (error) {
      throw new NotFoundException(new ErrorMessageDto(error.message));
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const deleteUser = await this.findOne(id);

      if (!deleteUser) {
        throw new NotFoundException(new ErrorMessageDto('User not found'));
      }

      this.userRepository.remove(deleteUser);
    } catch (error) {
      throw new NotFoundException(new ErrorMessageDto(error.message));
    }
  }
}
