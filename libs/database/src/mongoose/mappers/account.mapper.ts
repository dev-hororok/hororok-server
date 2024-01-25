import { ReadOnlyAccountDto } from '../dtos/readonly-account.dto';
import { Account } from '../entities/account.model';

export class AccountMapper {
  static toDto(account: Account): ReadOnlyAccountDto {
    const dto = new ReadOnlyAccountDto();

    dto.account_id = account.account_id;
    dto.email = account.email;
    dto.profile_url = account.profile_url;
    dto.name = account.name;
    dto.role = account.role;

    return dto;
  }
}
