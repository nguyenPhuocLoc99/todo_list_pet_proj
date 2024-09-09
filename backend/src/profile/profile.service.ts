import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProfileDto, EditProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfileById(profileId: number) {
    const profile = await this.prisma.userProfile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    return profile;
  }

  createProfile(dto: CreateProfileDto) {
    if (dto.onboardDate) dto.onboardDate = this.datetime2ISO(dto.onboardDate);

    return this.prisma.userProfile.create({
      data: {
        ...dto,
      },
    });
  }

  async editProfileById(profileId: number, dto: EditProfileDto) {
    const profile = await this.prisma.userProfile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    if (dto.userId === profile.userId)
      throw new ForbiddenException('The current user already has a profile');

    if (dto.onboardDate) dto.onboardDate = this.datetime2ISO(dto.onboardDate);

    await this.prisma.userProfile.update({
      where: {
        id: profileId,
      },
      data: {
        ...dto,
      },
    });
    return { message: `Profile ${profileId} edited` };
  }

  async deleteProfileById(profileId: number) {
    const profile = await this.prisma.userProfile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    await this.prisma.userProfile.delete({
      where: {
        id: profileId,
      },
    });
    return { message: `Profile ${profileId} deleted` };
  }

  datetime2ISO(inp: string) {
    if (inp) {
      const dateTimeRegex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
      if (!dateTimeRegex.test(inp))
        throw new ForbiddenException(
          'Start time must have format yyyy-mm-dd hh:mm:ss',
        );
      const [date_part, time_part] = inp.split(' ');
      return `${date_part}T${time_part}.000Z`;
    }
    return '';
  }
}
