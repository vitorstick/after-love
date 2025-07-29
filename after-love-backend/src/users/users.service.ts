import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password in the response
      },
    });
    return {
      message: 'All users retrieved successfully',
      data: users,
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password in the response
      },
    });
    return {
      message: user ? 'User found' : 'User not found',
      data: user || null,
    };
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: 'temp_password', // TODO: Hash password properly
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password in the response
      },
    });
    return {
      message: 'User created successfully',
      data: newUser,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          // Don't include password in the response
        },
      });
      return {
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch {
      return {
        message: 'User not found',
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          // Don't include password in the response
        },
      });
      return {
        message: 'User deleted successfully',
        data: deletedUser,
      };
    } catch {
      return {
        message: 'User not found',
        data: null,
      };
    }
  }
}
