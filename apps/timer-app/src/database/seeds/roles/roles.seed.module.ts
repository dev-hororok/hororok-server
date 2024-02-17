import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSeedService } from './roles.seed.service';
import { RoleEntity } from 'apps/timer-app/src/database/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleSeedService],
  exports: [RoleSeedService],
})
export class RoleSeedModule {}
