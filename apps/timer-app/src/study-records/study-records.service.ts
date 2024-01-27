import { StudyRecord } from '@app/database/typeorm/entities/study-record.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StudyRecordsService {
  constructor(
    @InjectRepository(StudyRecord)
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
