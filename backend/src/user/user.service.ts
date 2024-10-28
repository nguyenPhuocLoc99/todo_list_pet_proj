import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto, UserDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Get user by id
  async getUserById(userId: number, isAdmin: boolean) {
    if (!isAdmin)
      throw new UnauthorizedException('User does not have permission');

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  // Create user
  async createUser(dto: UserDto, isAdmin: boolean) {
    if (!isAdmin)
      throw new UnauthorizedException('User does not have permission');
    const user = await this.prisma.user.findFirst({
      where: {
        loginName: dto.loginName,
      },
    });

    if (user) throw new ForbiddenException('Credential taken');

    const hash = await argon.hash(dto.password);

    await this.prisma.user.create({
      data: {
        loginName: dto.loginName,
        hash,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        otherContacts: dto.otherContacts,
        isAdmin: dto.isAdmin,
      },
    });
    return { message: 'User created' };
  }

  // Edit user by id
  async editUserById(
    userId: number,
    dto: EditUserDto,
    isAdmin: boolean,
    currentUserId: number,
  ) {
    console.log({ userId, currentUserId });
    console.log(!isAdmin || userId !== currentUserId);
    if (!isAdmin &&  userId !== currentUserId)
      throw new UnauthorizedException('User does not have permission');

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    console.log(dto);

    if (!user) throw new NotFoundException('User not found');

    if (dto.password) {
      const hash = await argon.hash(dto.password);
      delete dto.password;
      dto['hash'] = hash;
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
  }

  // Delete user by id
  async deleteUserById(userId: number, isAdmin: boolean) {
    if (!isAdmin)
      throw new UnauthorizedException('User does not have permission');

    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
