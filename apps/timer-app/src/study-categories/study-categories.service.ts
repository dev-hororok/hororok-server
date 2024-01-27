import { StudyCategory } from '@app/database/typeorm/entities/study-category.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { CreateStudyCategoryInputDto } from './dtos/create-study-category.dto';
import { UpdateStudyCategoryInputDto } from './dtos/update-study-category.dto';
import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudyCategoriesService {
  constructor(
    @InjectRepository(StudyCategory)
    private studyCategoryRepository: Repository<StudyCategory>,
    @InjectRepository(StudyRecord)
    private studyRecordRepository: Repository<StudyRecord>,
  ) {}

  async create(member_id: string, { subject }: CreateStudyCategoryInputDto) {
    const exist = await this.studyCategoryRepository.findOne({
      where: {
        member: { member_id: member_id },
        subject,
      },
    });
    if (exist && !exist.hidden) {
      throw new BadRequestException('이미 동일한 카테고리가 존재합니다.');
    }
    // 만들어진 이력이 있으면 살려서 반환
    if (exist) {
      exist.hidden = false;
      const result = await this.studyCategoryRepository.save(exist);
      return result;
    }

    // 없으면 새로 생성
    const newCategory = this.studyCategoryRepository.create({
      member: {
        member_id,
      },
      subject,
      hidden: false,
    });

    const result = await this.studyCategoryRepository.save(newCategory);
    return result;
  }

  private async findOneByMemberIdAndSubject(
    member_id: string,
    subject: string,
  ) {
    return this.studyCategoryRepository.findOne({
      where: { subject, member: { member_id } },
    });
  }

  async findByMemberId(member_id: string) {
    const categories = await this.studyCategoryRepository.find({
      where: {
        member: {
          member_id,
        },
        hidden: false,
      },
    });
    return categories;
  }

  async delete(study_category_id: number) {
    const exist = await this.studyCategoryRepository.findOne({
      where: {
        study_category_id,
      },
    });
    if (!exist) {
      throw new BadRequestException('해당 카테고리가 존재하지 않습니다.');
    }
    if (exist.hidden) {
      throw new BadRequestException('이미 삭제된 카테고리입니다.');
    }
    exist.hidden = true;

    return this.studyCategoryRepository.save(exist);
  }

  async update(
    member_id: string,
    study_category_id: number,
    { subject }: UpdateStudyCategoryInputDto,
  ) {
    const existingCategory =
      await this.findCategoryWithRecords(study_category_id);

    console.log(existingCategory);
    this.validateCategoryExistence(existingCategory);
    this.validateSubjectChange(existingCategory, subject);

    const targetCategory = await this.findOneByMemberIdAndSubject(
      member_id,
      subject,
    );

    // target 기록 존재시 공부기록들의 카테고리를 타겟 카테고리로 수정 후 기존꺼 삭제
    if (targetCategory) {
      return this.mergeCategories(existingCategory, targetCategory);
    }
    // target 기록 없을시 기존 카테고리의 subject만 업데이트
    return this.updateCategorySubject(existingCategory, subject);
  }

  private async findCategoryWithRecords(study_category_id: number) {
    return this.studyCategoryRepository.findOne({
      where: { study_category_id },
      relations: { study_records: true },
    });
  }

  private validateCategoryExistence(category: StudyCategory | null) {
    if (!category) {
      throw new BadRequestException('해당 카테고리가 존재하지 않습니다.');
    }
  }

  private validateSubjectChange(category: StudyCategory, newSubject: string) {
    if (category.subject === newSubject) {
      throw new BadRequestException('변경된 내용이 없습니다.');
    }
  }

  // 기존 카테고리를 제거하고 타겟 카테고리에 공부기록 연결
  private async mergeCategories(
    existingCategory: StudyCategory,
    targetCategory: StudyCategory,
  ) {
    // 기존 카테고리에 속한 기록의 연결을 끊고 타겟 카테고리와 연결
    await this.studyRecordRepository.update(
      {
        study_record_id: In(
          existingCategory.study_records.map((s) => s.study_record_id),
        ),
      },
      {
        study_category: { study_category_id: targetCategory.study_category_id },
      },
    );

    if (targetCategory.hidden) {
      targetCategory.hidden = false;
      await this.studyCategoryRepository.save(targetCategory);
    }

    await this.studyCategoryRepository.delete(
      existingCategory.study_category_id,
    );
    return targetCategory;
  }

  private async updateCategorySubject(
    category: StudyCategory,
    newSubject: string,
  ) {
    category.subject = newSubject;
    await this.studyCategoryRepository.save(category);
    return category;
  }
}
