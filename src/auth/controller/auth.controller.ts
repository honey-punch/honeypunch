import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
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

    res.setHeader('Authorization', 'Bearer ' + access_token);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXP * 1000,
    });

    const maxAge = this.authService.getCooKieMaxAge(ACCESS_TOKEN_EXP);

    res.cookie('token_max_age', maxAge, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXP * 1000,
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

  @Get('/reissue')
  @UseGuards(JwtAuthGuard)
  async reissue(@Req() req, @Res() res: Response) {
    const user = req.user;
    const access_token = await this.authService.generateAccessToken(
      user.username,
    );

    res.setHeader('Authorization', 'Bearer ' + access_token);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXP * 1000,
    });

    const maxAge = this.authService.getCooKieMaxAge(ACCESS_TOKEN_EXP);

    res.cookie('token_max_age', maxAge, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXP * 1000,
    });

    return res.send({ access_token });
  }
}
