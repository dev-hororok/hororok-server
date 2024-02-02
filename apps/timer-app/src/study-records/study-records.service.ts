import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudyRecordInputDto } from './dtos/create-study-record.dto';
import { StudyCategoriesService } from '../study-categories/study-categories.service';
import { StudyCategory } from '@app/database/typeorm/entities/study-category.entity';

@Injectable()
export class StudyRecordsService {
  constructor(
    @InjectRepository(StudyRecord)
    private studyRecordRepository: Repository<StudyRecord>,
    private readonly studyCategoryService: StudyCategoriesService,
  ) {}

  async findAll(): Promise<StudyRecord[]> {
    return this.studyRecordRepository.find();
  }

  async findOne(id: number): Promise<StudyRecord> {
    return this.studyRecordRepository.findOne({
      where: { study_record_id: id },
    });
  }

  async findByMemberId(member_id: string): Promise<StudyRecord[]> {
    return this.studyRecordRepository.find({
      where: { member: { member_id } },
      relations: ['study_category'],
    });
  }

  async create({ member_id, category_id }: CreateStudyRecordInputDto) {
    let category: StudyCategory | null;

    if (category_id) {
      category = await this.studyCategoryService.findOneById(category_id);
      if (category.member.member_id !== member_id) {
        throw new BadRequestException('유저의 카테고리가 존재하지 않습니다.');
      }
    }

    const newRecord = this.studyRecordRepository.create({
      member: {
        member_id,
      },
      study_category: category,
      duration: 0,
    });

    const result = await this.studyRecordRepository.save(newRecord);
    return result;
  }

  async update(
    id: number,
    studyRecord: Partial<StudyRecord>,
  ): Promise<StudyRecord> {
    await this.studyRecordRepository.update(id, studyRecord);
    return this.studyRecordRepository.findOne({
      where: { study_record_id: id },
    });
  }

  async delete(id: number): Promise<void> {
    await this.studyRecordRepository.delete(id);
  }
}
