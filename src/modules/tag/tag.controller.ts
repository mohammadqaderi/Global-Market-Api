import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagDto } from './dto/tag.dto';


@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {
  }

  @Get()
  getAllTags() {
    return this.tagService.getAllTags();
  }

  @Post('new')
  newTag(@Body() createTagDto: TagDto) {
    return this.tagService.createNewTag(createTagDto);
  }

  @Delete(':id/delete-tag')
  deleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.deleteTag(id);
  }

  @Get(':id')
  getTagById(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.getTagById(id);
  }

  @Put(':id/update-tag')
  updateTag(@Param('id', ParseIntPipe) id: number, @Body() updateTagDto: TagDto) {
    return this.tagService.updateTag(id, updateTagDto);
  }

}
