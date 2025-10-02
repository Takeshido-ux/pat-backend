import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SendCodeDto {
  @ApiProperty({ example: '+1234567890', description: 'Номер телефона пользователя' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class VerifyCodeDto {
  @ApiProperty({ example: '+1234567890', description: 'Номер телефона пользователя' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '123456', description: '6-значный код верификации' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  code: string;
}
