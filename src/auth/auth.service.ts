import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    // TODO: Implement proper password hashing with bcrypt
    // TODO: Check if user already exists
    try {
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          name: registerDto.name,
          password: registerDto.password, // TODO: Hash this password
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          // Don't return password
        },
      });
      return {
        message: 'User registered successfully',
        data: user,
      };
    } catch {
      throw new BadRequestException('User with this email already exists');
    }
  }

  login(loginDto: LoginDto) {
    // TODO: Implement proper authentication with password verification and JWT
    return {
      message: 'Login endpoint - TODO: implement authentication',
      data: loginDto,
    };
  }

  getProfile() {
    // TODO: Implement get user profile logic with JWT verification
    return {
      message: 'User profile endpoint - TODO: implement JWT verification',
      user: { id: 1, email: 'user@example.com' },
    };
  }
}
