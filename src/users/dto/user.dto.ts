import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export interface PartnerStatusResponseDto {
  hasPartner: boolean;
  hasInvitation: boolean;
  invitationStatus?: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
  invitedEmail?: string;
  partnerName?: string;
  invitationCreatedAt?: Date;
  invitationExpiresAt?: Date;
}
