import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/service/user.service';
import { Payload } from './auth.dto';
import { Request } from 'express';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { JWT_SECRET } from './constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      secretOrKey: JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Payload) {
    const refreshToken = req.cookies['refresh_token'];
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });
    const result: User = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      user.username,
    );
    return result;
  }
}
