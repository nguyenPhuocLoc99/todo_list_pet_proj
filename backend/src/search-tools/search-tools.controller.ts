import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { SearchToolsService } from './search-tools.service';

@UseGuards(JwtGuard)
@Controller('search-tools')
export class SearchToolsController {
  constructor(private searchService: SearchToolsService) {}

  @Get()
  searchTaskAndTaskGroup(@Body() keywordObj: object) {
    return this.searchService.searchTaskAndTaskGroup(keywordObj);
  }
}
