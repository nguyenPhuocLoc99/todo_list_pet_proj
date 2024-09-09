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
import { ProfileService } from './profile.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateProfileDto, EditProfileDto } from './dto';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get(':id')
  getProfileById(@Param('id', ParseIntPipe) profileId: number) {
    return this.profileService.getProfileById(profileId);
  }

  @Post('create')
  createProfile(@Body() dto: CreateProfileDto) {
    return this.profileService.createProfile(dto);
  }

  @Patch(':id')
  editProfileById(
    @Param('id', ParseIntPipe) profileId: number,
    @Body() dto: EditProfileDto,
  ) {
    return this.profileService.editProfileById(profileId, dto);
  }

  @Delete(':id')
  deleteProfileById(@Param('id', ParseIntPipe) profileId: number) {
    return this.profileService.deleteProfileById(profileId);
  }
}
