import { Module } from '@nestjs/common';
import { SearchToolsController } from './search-tools.controller';
import { SearchToolsService } from './search-tools.service';

@Module({
  controllers: [SearchToolsController],
  providers: [SearchToolsService]
})
export class SearchToolsModule {}
