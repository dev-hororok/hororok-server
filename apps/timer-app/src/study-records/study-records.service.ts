import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class StudyRecordsService {
  constructor(
    @Inject('STUDY_RECORD_REPOSITORY')
    private studyRecordRepository: Repository<StudyRecord>,
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
}
