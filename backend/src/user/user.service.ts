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

  async createUser(dto: UserDto, isAdmin: boolean) {
    if (!isAdmin)
      throw new UnauthorizedException('User does not have permission');
    const user = await this.prisma.user.findFirst({
      where: {
        loginName: dto.login_name,
      },
    });

    if (user) throw new ForbiddenException('Credential taken');

    const hash = await argon.hash(dto.password);

    await this.prisma.user.create({
      data: {
        loginName: dto.login_name,
        hash,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        otherContacts: dto.other_contacts,
        isAdmin: dto.is_admin,
      },
    });
    return { message: 'User created' };
  }

  async editUserById(userid: number, dto: EditUserDto, isAdmin: boolean) {
    if (!isAdmin)
      throw new UnauthorizedException('User does not have permission');

    const user = await this.prisma.user.findFirst({
      where: {
        id: userid,
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
        id: userid,
      },
      data: {
        ...dto,
      },
    });
  }

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
