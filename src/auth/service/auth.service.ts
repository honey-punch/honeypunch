import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async me(jwt: string) {
    return await this.jwtService.verifyAsync(jwt, { secret: 'abc' });
  }
}
