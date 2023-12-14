import {
  Controller,
  Get,
  Delete,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '@prisma/client';
import { UserGuard } from '../user.guard';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserGuard)
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

  @UseGuards(UserGuard)
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
