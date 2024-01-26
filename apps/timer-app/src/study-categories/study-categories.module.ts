import { Module } from '@nestjs/common';
import { StudyCategoriesService } from './study-categories.service';
import { StudyCategoriesProviders } from './study-categories.providers';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  providers: [...StudyCategoriesProviders, StudyCategoriesService],
  exports: [StudyCategoriesService],
})
export class StudyCategoriesModule {}
