import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendCodeDto, VerifyCodeDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { API_MESSAGES } from './constants/messages';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('send-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: API_MESSAGES.OPERATIONS.SEND_CODE })
  @ApiResponse({ status: 200, description: API_MESSAGES.RESPONSES.CODE_SENT })
  @ApiResponse({ status: 400, description: API_MESSAGES.RESPONSES.BAD_REQUEST })
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.authService.sendCode(sendCodeDto.phoneNumber);
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: API_MESSAGES.OPERATIONS.VERIFY_CODE })
  @ApiResponse({ status: 200, description: API_MESSAGES.RESPONSES.LOGIN_SUCCESS })
  @ApiResponse({ status: 401, description: API_MESSAGES.RESPONSES.INVALID_CODE })
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyCode(verifyCodeDto.phoneNumber, verifyCodeDto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiOperation({ summary: API_MESSAGES.OPERATIONS.GET_PROFILE })
  @ApiResponse({ status: 200, description: API_MESSAGES.RESPONSES.USER_PROFILE })
  getProfile(@Request() req) {
    return req.user;
  }
}
