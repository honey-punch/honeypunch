import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Login } from '../user.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async fetchAllUser(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async fetchUser(username: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { username },
    });
  }

  async createUser(data: User): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }

  async updateUser(
    id: string,
    username: string,
    password: string,
  ): Promise<User | null> {
    return this.prismaService.user.update({
      where: { username },
      data: {
        id: id,
        username: username,
        password: password,
      },
    });
  }

  async deleteUser(username: string): Promise<User | null> {
    return this.prismaService.user.delete({
      where: { username },
    });
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
