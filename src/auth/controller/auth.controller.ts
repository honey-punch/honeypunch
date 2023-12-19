import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';
import { UserService } from 'src/user/service/user.service';
import {
  Login,
  RefreshDto,
  LoginRequestDto,
  LogoutRequestDto,
} from 'src/auth/auth.dto';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { JwtRefreshGuard } from '../jwt-refresh.guard';
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from '../constants';

@Controller('/api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  async login(
    @Body() data: LoginRequestDto,
    @Res() res: Response,
  ): Promise<Response<Login>> {
    const user = await this.authService.validateUser(
      data.username,
      data.password,
    );
    const access_token = await this.authService.generateAccessToken(
      data.username,
      data.password,
    );
    const refresh_token = await this.authService.generateRefreshToken(
      data.username,
      data.password,
    );

    await this.userService.setCurrentRefreshToken(user.username, refresh_token);
    const updatedUser = await this.userService.fetchUser(user.username);
    res.setHeader('Authorization', 'Bearer ' + [access_token, refresh_token]);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      maxAge: ACCESS_TOKEN_EXP,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXP,
    });
    return res.send({ access_token, refresh_token, user: updatedUser });
  }

  @Post('/refresh')
  async refresh(
    @Body() refreshToken: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const newAccessToken = (await this.authService.refresh(refreshToken))
        .access_token;
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
      });
      res.send({ access_token: newAccessToken });
    } catch (error) {
      throw new UnauthorizedException('fuck');
    }
  }

  @Post('/logout')
  @UseGuards(JwtRefreshGuard)
  async logout(
    @Body()
    user: LogoutRequestDto,
    @Res() res: Response,
  ) {
    await this.userService.removeRefreshToken(user.username);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.send({
      message: 'logout success',
    });
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
