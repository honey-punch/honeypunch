import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../service/auth.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Get()
  async me(@Req() req: Request): Promise<any> {
    const jwt = req.cookies['jwt'];
    const result = await this.userService.me(jwt);
    return result;
  }
}
