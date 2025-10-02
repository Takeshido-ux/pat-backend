import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { WhatsAppService } from './whatsapp.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private whatsappService: WhatsAppService,
  ) {}

  async sendCode(phoneNumber: string) {
    return this.whatsappService.sendVerificationCode(phoneNumber);
  }

  async verifyCode(phoneNumber: string, code: string) {
    const verification = await this.whatsappService.verifyCode(phoneNumber, code);
    
    if (!verification.valid) {
      throw new UnauthorizedException(verification.message);
    }

    // Ищем или создаем пользователя
    let user = await this.usersService.findByPhoneNumber(phoneNumber);
    if (!user) {
      user = await this.usersService.create(phoneNumber, 'temp'); // временный PIN
    }

    return this.login(user);
  }

  async login(user: User) {
    const payload = { phoneNumber: user.phoneNumber, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        username: user.phoneNumber, // Добавляем username для совместимости с frontend
      },
    };
  }

}
