import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MemberEntity } from '../../entities/member.entity';
import { CharacterInventoryEntity } from '../../entities/character-inventory.entity';
import { MemberCharacterCollectionEntity } from '../../entities/member-character-collection.entity';

@Injectable()
export class MemberCharacterCollectionMigrateService {
  constructor(
    @InjectRepository(MemberEntity)
    private memberRepository: Repository<MemberEntity>,
    @InjectRepository(CharacterInventoryEntity)
    private characterInventoryRepository: Repository<CharacterInventoryEntity>,
    @InjectRepository(MemberCharacterCollectionEntity)
    private collectionRepository: Repository<MemberCharacterCollectionEntity>,
  ) {}

  async run() {
    let tasks = 0;
    let alreadySuccess = 0;
    let success = 0;
    const members = await this.memberRepository.find();

    for (const member of members) {
      const characterInventories = await this.characterInventoryRepository.find(
        {
          where: {
            member: {
              member_id: member.member_id,
            },
          },
          relations: ['character'],
        },
      );

      for (const characterInventory of characterInventories) {
        ++tasks;
        try {
          const exist = await this.collectionRepository.findOne({
            where: {
              member: { member_id: member.member_id },
              character: {
                character_id: characterInventory.character?.character_id,
              },
            },
          });
          if (exist) {
            ++alreadySuccess;
            continue;
          }
          const newCollection = this.collectionRepository.create({
            character: characterInventory.character,
            member: member,
          });
          await this.collectionRepository.save(newCollection);
          ++success;
        } catch (e) {
          console.error(
            '마이그레이션 중 에러: ',
            member.member_id,
            characterInventory.character_inventory_id,
            e,
          );
        }
      }
    }

    console.log('마이그레이션 완료: ', success, '/', tasks);
    console.log('이미 존재하는 데이터: ', alreadySuccess, '/', tasks);
    console.log(
      '총 결과 (데이터 일치): ',
      success + alreadySuccess,
      '/',
      tasks,
    );
  }
}
