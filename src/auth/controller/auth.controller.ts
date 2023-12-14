import { Controller, Get, Post, Req, Res, Body } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../service/auth.service';
import { User } from '@prisma/client';
import { Auth, Login } from 'src/auth/auth.dto';
import { Response } from 'express';

@Controller('/api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/auth')
  async me(@Req() req: Request): Promise<Auth> {
    const jwt = req.cookies['jwt'];
    if (!jwt) return { status: false };

    const result = await this.authService.me(jwt);
    return result.sub ? { status: true } : { status: false };
  }

  @Post('/login')
  async login(
    @Body() data: Omit<User, 'id'>,
    @Res() res: Response,
  ): Promise<Response<Login> | null> {
    const loginUser = await this.authService.login(
      data.username,
      data.password,
    );
    res.setHeader('Authorization', 'Bearer ' + loginUser.access_token);
    res.cookie('jwt', loginUser.access_token, {
      httpOnly: true,
      maxAge: 60 * 1000,
    });
    return res.send(loginUser);
  }
}
