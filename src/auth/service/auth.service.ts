import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ACCESS_TOKEN_EXP } from '../constants';
import { UserService } from 'src/user/service/user.service';

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

  async generateAccessToken(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    return this.jwtService.signAsync(
      { sub: user.id, username: user.username },
      { expiresIn: ACCESS_TOKEN_EXP },
    );
  }

  getCooKieMaxAge(maxAge: number) {
    const currentTime = new Date();
    currentTime.setSeconds(currentTime.getSeconds() + maxAge);

    return currentTime.toISOString();
  }
}
