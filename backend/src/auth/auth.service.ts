import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthSignUpDto, AuthLoginDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthSignUpDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);

    // save the new user to the db
    try {
      const user = await this.prisma.user.create({
        data: {
          loginName: dto.login_name,
          name: dto.name,
          hash,
          email: dto.email,
          phone: dto.phone,
          otherContacts: dto.other_contacts,
        },
      });

      return this.signToken(user.id, user.loginName);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async login(dto: AuthLoginDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        loginName: dto.login_name,
      },
    });
    // throw exception if the user does not exist
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // throw exception if the password is incorrect
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    // send back the user
    return this.signToken(user.id, user.loginName);
  }

  async signToken(
    userId: number,
    login_name: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      subfield: userId,
      login_name,
    };
    const secret = this.config.get('JWT_SECRET');
    const signOptions = {
      expiresIn: '30m',
      secret: secret,
    };
    const token = await this.jwt.signAsync(payload, signOptions);

    return { access_token: token };
  }
}
