import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from '../constants';
import { RefreshDto } from '../auth.dto';
import { UserService } from 'src/user/service/user.service';
import { JWT_SECRET } from '../constants';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { username, password },
    });

    return user;
  }

  async generateAccessToken(username: string, password: string) {
    const user = await this.validateUser(username, password);
    return this.jwtService.signAsync(
      { sub: user.id, username: user.username },
      { expiresIn: ACCESS_TOKEN_EXP / 1000 },
    );
  }

  async generateRefreshToken(username: string, password: string) {
    const user = await this.validateUser(username, password);

    return this.jwtService.signAsync(
      { sub: user.id },
      { secret: JWT_SECRET, expiresIn: REFRESH_TOKEN_EXP / 1000 },
    );
  }

  async refresh(
    refreshTokenDto: RefreshDto,
  ): Promise<{ access_token: string }> {
    const { refresh_token } = refreshTokenDto;
    const decodedRefreshToken = await this.jwtService.verifyAsync(
      refresh_token,
      {
        secret: JWT_SECRET,
      },
    );

    const user = await this.prismaService.user.findUnique({
      where: { id: decodedRefreshToken.sub },
    });

    const result = await this.userService.getUserIfRefreshTokenMatches(
      refresh_token,
      user.username,
    );

    if (!result) {
      return null;
    }

    const access_token = await this.generateAccessToken(
      result.username,
      result.password,
    );
    return { access_token };
  }
}
