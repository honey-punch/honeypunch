import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async fetchAllUser(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async fetchUser(id: number): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id: Number(id) },
    });
  }

  async createUser(data: User): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }

  async updateUser(
    id: number,
    username: string,
    password: string,
  ): Promise<User | null> {
    return this.prismaService.user.update({
      where: { id: Number(id) },
      data: {
        username: username,
        password: password,
      },
    });
  }

  async deleteUser(id: number): Promise<User | null> {
    return this.prismaService.user.delete({
      where: { id: Number(id) },
    });
  }
}
