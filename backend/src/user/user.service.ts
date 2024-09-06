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

  getUserById(userId: number, is_admin: boolean) {
    if (!is_admin)
      throw new UnauthorizedException('User does not have permission');
    return this.prisma.user.findFirst({
      where: {
        user_id: userId,
      },
    });
  }

  async createUser(dto: UserDto, is_admin: boolean) {
    if (!is_admin)
      throw new UnauthorizedException('User does not have permission');
    const user = await this.prisma.user.findFirst({
      where: {
        login_name: dto.login_name,
      },
    });

    if (user) throw new ForbiddenException('Credential taken');

    const hash = await argon.hash(dto.password);

    await this.prisma.user.create({
      data: {
        login_name: dto.login_name,
        hash,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        other_contacts: dto.other_contacts,
        is_admin: dto.is_admin,
      },
    });
    return { message: 'User created' };
  }

  async editUserById(userid: number, dto: EditUserDto, is_admin: boolean) {
    if (!is_admin)
      throw new UnauthorizedException('User does not have permission');

    const user = await this.prisma.user.findFirst({
      where: {
        user_id: userid,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    if (dto.password) {
      const hash = await argon.hash(dto.password);
      delete dto.password;
      dto['hash'] = hash;
    }

    return this.prisma.user.update({
      where: {
        user_id: userid,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteUserById(userId: number, is_admin: boolean) {
    if (!is_admin)
      throw new UnauthorizedException('User does not have permission');

    await this.prisma.user.delete({
      where: {
        user_id: userId,
      },
    });
  }
}
