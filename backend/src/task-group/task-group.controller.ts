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
import { TaskGroupService } from './task-group.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateTaskGroupDto, EditTaskGroupDto } from './dto';

@UseGuards(JwtGuard)
@Controller('groups')
export class TaskGroupController {
  constructor(private groupService: TaskGroupService) {}

  @Get(':id')
  getGroupById(@Param('id', ParseIntPipe) groupId: number) {
    return this.groupService.getGroupById(groupId);
  }

  @Post('create')
  createGroup(@Body() dto: CreateTaskGroupDto) {
    return this.groupService.createGroup(dto);
  }

  @Patch(':id')
  editGroupById(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() dto: EditTaskGroupDto,
  ) {
    return this.groupService.editGroupById(groupId, dto);
  }

  @Delete(':id')
  deleteGroupById(@Param('id', ParseIntPipe) groupId: number) {
    return this.groupService.deleteGroupById(groupId);
  }
}
