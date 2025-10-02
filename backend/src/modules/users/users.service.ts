import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(phoneNumber: string, pinCode: string): Promise<User> {
    const user = this.usersRepository.create({
      phoneNumber,
      pinCode,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'phoneNumber', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'phoneNumber', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { phoneNumber },
    });
  }

  async updatePinCode(id: number, pinCode: string): Promise<User> {
    await this.usersRepository.update(id, { pinCode });
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
