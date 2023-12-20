import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthStrategy } from './jwt-auth.strategy';
import { UserService } from 'src/user/service/user.service';
import { JWT_SECRET } from './constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
    }),
    UserModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserService, JwtAuthStrategy],
})
export class AuthModule {}
