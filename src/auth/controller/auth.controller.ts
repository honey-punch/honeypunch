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
  async me(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Auth | Response> {
    const jwt = req.cookies['jwt'];
    if (!jwt) {
      res.status(401);
      return res.send({ status: false });
    }

    const result = await this.authService.me(jwt);

    if (result.sub) {
      res.status(200);
      return res.send({ message: true });
    } else {
      res.status(401);
      return res.send({ message: false });
    }
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
