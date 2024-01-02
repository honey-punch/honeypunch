import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';
import { Login, LoginRequestDto } from 'src/auth/auth.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { ACCESS_TOKEN_EXP } from '../constants';

@Controller('/api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() data: LoginRequestDto,
    @Res() res: Response,
  ): Promise<Response<Login>> {
    const user = await this.authService.validateUser(
      data.username,
      data.password,
    );
    if (!user) return;

    const access_token = await this.authService.generateAccessToken(
      data.username,
    );
    const maxAge = this.authService.getCooKieMaxAge(ACCESS_TOKEN_EXP);

    res.setHeader('Authorization', 'Bearer ' + access_token);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXP * 1000,
      path: '/',
    });

    res.cookie('token_max_age', maxAge, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXP * 1000,
      path: '/',
    });

    return res.send({ access_token, user });
  }

  @Get('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('token_max_age');
    return res.send({
      message: 'logout success',
    });
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('/reissue/:username')
  @UseGuards(JwtAuthGuard)
  async reissue(
    @Param('username') username: string,
    @Res() res: Response,
  ): Promise<Response<{ access_token: string }>> {
    res.clearCookie('access_token');
    res.clearCookie('token_max_age');

    const access_token = await this.authService.generateAccessToken(username);
    const token_max_age = this.authService.getCooKieMaxAge(ACCESS_TOKEN_EXP);

    res.setHeader('Authorization', 'Bearer ' + access_token);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXP * 1000,
      path: '/',
    });

    res.cookie('token_max_age', token_max_age, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXP * 1000,
      path: '/',
    });

    return res.send({ access_token, token_max_age });
  }
}
