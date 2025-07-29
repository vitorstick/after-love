import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  // Mock data for now
  private users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  findAll() {
    return {
      message: 'All users retrieved successfully',
      data: this.users,
    };
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    return {
      message: user ? 'User found' : 'User not found',
      data: user || null,
    };
  }

  create(createUserDto: CreateUserDto) {
    const newUser = {
      id: this.users.length + 1,
      ...createUserDto,
    };
    this.users.push(newUser);
    return {
      message: 'User created successfully',
      data: newUser,
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return {
        message: 'User not found',
        data: null,
      };
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return {
      message: 'User updated successfully',
      data: this.users[userIndex],
    };
  }

  remove(id: number) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return {
        message: 'User not found',
        data: null,
      };
    }
    const deletedUser = this.users.splice(userIndex, 1)[0];
    return {
      message: 'User deleted successfully',
      data: deletedUser,
    };
  }
}
