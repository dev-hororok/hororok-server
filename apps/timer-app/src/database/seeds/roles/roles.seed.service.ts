import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'apps/timer-app/src/database/entities/role.entity';
import { Repository } from 'typeorm';
import { RoleSeeds } from '../accounts.seed';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    for (const role of RoleSeeds) {
      const countUser = await this.repository.count({
        where: {
          role_id: role.id,
        },
      });

      if (!countUser) {
        await this.repository.save(
          this.repository.create({
            role_id: role.id,
            name: role.name,
          }),
        );
      }
    }
  }
}
