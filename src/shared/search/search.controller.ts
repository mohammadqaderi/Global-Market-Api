import { Body, Controller, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { ISearch } from '../../commons/interfaces/search.interface';

@Controller('search')
export class SearchController {

  constructor(private searchService: SearchService) {

  }

  @Post()
  search(@Body() searchPayload: ISearch) {
    const { name, limit, page, take, type } = searchPayload;
    return this.searchService.search(name, type, take, page, limit);
  }
}
