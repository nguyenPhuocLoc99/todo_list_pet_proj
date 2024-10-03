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
import { GetUser, Permissions } from 'src/auth/decorator';
import { JwtGuard, PermissonsGuard } from 'src/auth/guard';
import { CreateTaskGroupDto, EditTaskGroupDto, GroupAccessDto } from './dto';

@UseGuards(JwtGuard, PermissonsGuard)
@Controller('groups')
export class TaskGroupController {
  constructor(private groupService: TaskGroupService) {}

  @Get(':id')
  @Permissions('read')
  getGroupById(@Param('id', ParseIntPipe) groupId: number) {
    return this.groupService.getGroupById(groupId);
  }

  @Get('')
  getGroupsList(@GetUser('id') userId: number) {
    return this.groupService.getGroupsList(userId);
  }

  @Get(':id/tasks')
  getGroupTasksList(@Param('id', ParseIntPipe) groupId: number) {
    return this.groupService.getGroupTasksList(groupId);
  }

  @Post('create')
  createGroup(@Body() dto: CreateTaskGroupDto, @GetUser('id') userId: number) {
    return this.groupService.createGroup(dto, userId);
  }

  @Post(':id/create')
  @Permissions('updateAccess')
  createGroupAccess(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() dto: GroupAccessDto,
  ) {
    return this.groupService.createGroupAccess(groupId, dto);
  }

  @Patch(':id')
  @Permissions('updateInfo')
  editGroupById(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() dto: EditTaskGroupDto,
  ) {
    return this.groupService.editGroupById(groupId, dto);
  }

  @Patch(':id/access')
  @Permissions('updateAccess')
  editGroupAccess(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() dto: GroupAccessDto,
  ) {
    return this.groupService.editGroupAccess(groupId, dto);
  }

  @Delete(':id')
  deleteGroupById(@Param('id', ParseIntPipe) groupId: number) {
    return this.groupService.deleteGroupById(groupId);
  }

  @Delete(':id/access')
  @Permissions('updateAccess')
  deleteGroupAccess(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: GroupAccessDto,
  ) {
    return this.groupService.deleteGroupAccess(taskId, dto);
  }
}
