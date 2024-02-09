import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StudyCategoriesService } from '../../study-categories/study-categories.service';
import { PermissionsGuard } from '../guards/permissions.guard';
import { CreateStudyCategoryInputDto } from '../../study-categories/dtos/create-study-category.dto';
import { UpdateStudyCategoryInputDto } from '../../study-categories/dtos/update-study-category.dto';
import { StudyCategoryMapper } from '@app/database/typeorm/mappers/study-category.mapper';

@UseGuards(PermissionsGuard)
@Controller('members/:member_id/study-categories')
export class MemberStudyCategoriesController {
  constructor(
    private readonly studyCategoriesService: StudyCategoriesService,
  ) {}

  @Post()
  async createCategory(
    @Param('member_id') memberId: string,
    @Body() createStudyCategoryDto: CreateStudyCategoryInputDto,
  ) {
    const newCategory = await this.studyCategoriesService.create(
      memberId,
      createStudyCategoryDto,
    );
    return {
      category: StudyCategoryMapper.toDto(newCategory),
    };
  }

  @Get()
  async getStudyCategories(@Param('member_id') memberId: string) {
    const categories = await this.studyCategoriesService.findAll({
      where: { member: { member_id: memberId } },
    });
    return {
      study_categories: categories.map((category) =>
        StudyCategoryMapper.toDto(category),
      ),
    };
  }

  @Delete(':study_category_id')
  async deleteCategory(@Param('study_category_id') studyCategoryId: number) {
    await this.studyCategoriesService.delete(studyCategoryId);
    return null;
  }

  @Patch(':study_category_id')
  async updateCategory(
    @Param('member_id') memberId: string,
    @Param('study_category_id') studyCategoryId: number,
    @Body() updateStudyCategoryDto: UpdateStudyCategoryInputDto,
  ) {
    await this.studyCategoriesService.update(
      memberId,
      studyCategoryId,
      updateStudyCategoryDto,
    );
    return null;
  }
}
