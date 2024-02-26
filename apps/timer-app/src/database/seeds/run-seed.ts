import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seeds.module';
import { RoleSeedService } from './roles/roles.seed.service';
import { AccountSeedService } from './accounts/accounts.seed.service';
import { MemberSeedService } from './members/members.seed.service';

// 시드 모듈을 불러와서 각 서비스 run 실행
const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  await app.get(RoleSeedService).run();
  await app.get(AccountSeedService).run();
  await app.get(MemberSeedService).run();

  await app.close();
};

void runSeed();
