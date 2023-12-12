import {
  Controller,
  Get,
  Delete,
  Post,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '@prisma/client';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async fetchAllUser(): Promise<User[]> {
    return this.userService.fetchAllUser();
  }

  @Get(':id')
  async fetchUser(@Param('id') username: string): Promise<User | null> {
    return this.userService.fetchUser(username);
  }

  @Post()
  async createUser(@Body() data: User): Promise<User | null> {
    return this.userService.createUser(data);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: User,
  ): Promise<User | null> {
    return this.userService.updateUser(id, data.username, data.password);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User | null> {
    return this.userService.deleteUser(id);
  }
}
