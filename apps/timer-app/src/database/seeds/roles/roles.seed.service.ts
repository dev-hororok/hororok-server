import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'apps/timer-app/src/database/entities/role.entity';
import { RoleEnum } from 'apps/timer-app/src/roles/roles.enum';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        role_id: RoleEnum.user,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          role_id: RoleEnum.user,
          name: 'User',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        role_id: RoleEnum.admin,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          role_id: RoleEnum.admin,
          name: 'Admin',
        }),
      );
    }
  }
}
