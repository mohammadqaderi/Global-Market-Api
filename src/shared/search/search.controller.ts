import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {

  constructor(private searchService: SearchService) {

  }

  @Get(':name/:type')
  search(@Param('name') name: string, @Param('type') type: string,
         @Query('take', ParseIntPipe) take: number) {
    return this.searchService.search(name, type, take);
  }
}
