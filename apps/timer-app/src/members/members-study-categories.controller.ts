import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudyCategoriesService } from '../study-categories/study-categories.service';
import { PermissionsGuard } from './guards/permissions.guard';
import { CreateStudyCategoryInputDto } from '../study-categories/dtos/create-study-category.dto';
import { UpdateStudyCategoryInputDto } from '../study-categories/dtos/update-study-category.dto';
import { StudyCategoryMapper } from '@app/database/typeorm/mappers/study-category.mapper';

@UseGuards(PermissionsGuard)
@Controller('members/:member_id/study-categories')
export class MemberStudyCategoriesController {
  constructor(
    private readonly studyCategoriesService: StudyCategoriesService,
  ) {}

  @Post()
  async createCategory(
    @Req() req,
    @Param('member_id') member_id: string,
    @Body() createStudyCategoryDto: CreateStudyCategoryInputDto,
  ) {
    const newCategory = await this.studyCategoriesService.create(
      member_id,
      createStudyCategoryDto,
    );
    return {
      category: StudyCategoryMapper.toDto(newCategory),
    };
  }

  @Get()
  async getStudyCategories(@Param('member_id') member_id: string) {
    const categories =
      await this.studyCategoriesService.findByMemberId(member_id);
    return {
      study_categories: categories.map((category) =>
        StudyCategoryMapper.toDto(category),
      ),
    };
  }

  @Delete(':study_category_id')
  async deleteCategory(@Param('study_category_id') study_category_id: number) {
    await this.studyCategoriesService.delete(study_category_id);
    return null;
  }

  @Patch(':study_category_id')
  async updateCategory(
    @Param('member_id') member_id: string,
    @Param('study_category_id') study_category_id: number,
    @Body() updateStudyCategoryDto: UpdateStudyCategoryInputDto,
  ) {
    const updatedCategory = await this.studyCategoriesService.update(
      member_id,
      study_category_id,
      updateStudyCategoryDto,
    );
    return { study_category: StudyCategoryMapper.toDto(updatedCategory) };
  }
}
