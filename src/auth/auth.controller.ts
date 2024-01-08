import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { Response } from 'express';
import { ErrorFormanderaNotFound } from 'src/base/error';
import { SignInDto } from './signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Res() response: Response, @Body() signInDto: SignInDto) {
    try {
      const token = await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      );
      response.status(HttpStatus.OK).json(token).send();
    } catch (error: any) {
      if (error instanceof ErrorFormanderaNotFound) {
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new NotFoundException(error.message))
          .send();
      } else if (error instanceof UnauthorizedException)
        response.status(HttpStatus.UNAUTHORIZED).json(error).send();
    }
  }
}
