import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'abc',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
