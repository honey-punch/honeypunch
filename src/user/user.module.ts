import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { PrismaService } from '../prisma.service';
import { JwtAuthStrategy } from '../auth/jwt-auth.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtAuthStrategy],
})
export class UserModule {}
