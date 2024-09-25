import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto, UserDto } from './dto';
import { UserService } from './user.service';

// try to fix a bug
import * as runtime from '@prisma/client/runtime/library.js';
type User = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get(':id')
  getUserById(
    @GetUser('isAdmin') is_admin: boolean,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.getUserById(id, is_admin);
  }

  @Post('create')
  createUser(@GetUser('isAdmin') is_admin: boolean, @Body() dto: UserDto) {
    return this.userService.createUser(dto, is_admin);
  }

  @Patch(':id')
  editUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditUserDto,
    @GetUser('isAdmin') is_admin: boolean,
  ) {
    return this.userService.editUserById(id, dto, is_admin);
  }

  @Delete(':id')
  deleteUserById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('isAdmin') is_admin: boolean,
  ) {
    return this.userService.deleteUserById(id, is_admin);
  }
}
