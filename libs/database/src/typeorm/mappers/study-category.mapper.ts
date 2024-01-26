import { ReadOnlyStudyCategoryDto } from '../dtos/readonly-study-category.dto';
import { StudyCategory } from '../entities/study-category.entity';

export class StudyCategoryMapper {
  static toDto(study_category: StudyCategory): ReadOnlyStudyCategoryDto {
    const dto = new ReadOnlyStudyCategoryDto();

    dto.study_category_id = study_category.study_category_id;
    dto.subject = study_category.subject;

    return dto;
  }
}
