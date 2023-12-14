import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Login } from 'src/auth/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async me(jwt: string) {
    return await this.jwtService.verifyAsync(jwt, { secret: 'abc' });
  }

  async login(username: string, password: string): Promise<Login | null> {
    const user = await this.prismaService.user.findUnique({
      where: { username, password },
    });

    if (!user) return;

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token, user };
  }
}
