import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
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

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        coupleId: true,
        // Don't include password in the response
      },
    });
    return {
      message: user ? 'User found' : 'User not found',
      data: user || null,
    };
  }

  // Note: For user registration, use the AuthService.register() method instead
  // This method is for admin/system use only
  async create(createUserDto: CreateUserDto) {
    // Hash a placeholder password - users created this way should reset their password
    const saltRounds = 12;
    const placeholderPasswordHash = await bcrypt.hash(
      'SYSTEM_USER_' + Date.now(),
      saltRounds,
    );

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        passwordHash: placeholderPasswordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        coupleId: true,
        // Don't include password in the response
      },
    });
    return {
      message: 'User created successfully (password must be set via auth flow)',
      data: newUser,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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
          coupleId: true,
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

  // Method to securely update user password (admin use)
  async updatePassword(id: string, newPassword: string) {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await this.prisma.user.update({
        where: { id },
        data: {
          passwordHash: hashedPassword,
        },
      });

      return {
        message: 'Password updated successfully',
        data: { id },
      };
    } catch {
      return {
        message: 'User not found',
        data: null,
      };
    }
  }

  async remove(id: string) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          coupleId: true,
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

  async getPartnerStatus(userId: string) {
    try {
      // First, check if user exists and get their couple info
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          couple: {
            include: {
              partner1: {
                select: { id: true, name: true, email: true },
              },
              partner2: {
                select: { id: true, name: true, email: true },
              },
              invitation: true,
            },
          },
          invitationsSent: {
            where: {
              status: {
                in: ['PENDING', 'ACCEPTED'],
              },
            },
            include: {
              couple: {
                include: {
                  partner2: {
                    select: { id: true, name: true, email: true },
                  },
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });

      if (!user) {
        return {
          message: 'User not found',
          data: null,
        };
      }

      // Check if user is already in a couple with a partner
      if (user.couple && user.couple.partner2Id) {
        const partner =
          user.couple.partner1Id === userId
            ? user.couple.partner2
            : user.couple.partner1;

        return {
          message: 'Partner status retrieved successfully',
          data: {
            hasPartner: true,
            hasInvitation: false,
            invitationStatus: 'ACCEPTED' as const,
            partnerName: partner?.name || 'Unknown',
          },
        };
      }

      // Check if user has sent an invitation
      if (user.invitationsSent.length > 0) {
        const invitation = user.invitationsSent[0];

        return {
          message: 'Partner status retrieved successfully',
          data: {
            hasPartner: false,
            hasInvitation: true,
            invitationStatus: invitation.status as
              | 'PENDING'
              | 'ACCEPTED'
              | 'EXPIRED'
              | 'CANCELLED',
            invitedEmail: invitation.invitedEmail,
            invitationCreatedAt: invitation.createdAt,
            invitationExpiresAt: invitation.expiresAt,
            partnerName: invitation.couple.partner2?.name,
          },
        };
      }

      // No partner or invitation
      return {
        message: 'Partner status retrieved successfully',
        data: {
          hasPartner: false,
          hasInvitation: false,
        },
      };
    } catch {
      return {
        message: 'Error retrieving partner status',
        data: null,
      };
    }
  }
}
