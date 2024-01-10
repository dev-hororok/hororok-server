import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { Role } from './role.enum';
import * as crypto from 'crypto';
import { ReadOnlyAccountDto } from '../dtos/readonly-account.dto';

@Schema({
  timestamps: true,
  collection: 'accounts',
})
export class Account extends Document {
  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Prop({
    required: true,
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  profile_url: string;

  @Prop({
    default: () => crypto.randomBytes(10).toString('hex'),
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @Prop({
    required: true,
    enum: Role,
    default: Role.User,
  })
  role: Role;

  readonly readOnlyData: ReadOnlyAccountDto;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.virtual('readOnlyData').get(function (
  this: Account,
): ReadOnlyAccountDto {
  return {
    profile_url: this.profile_url,
    id: this._id,
    email: this.email,
    role: this.role,
    name: this.name,
  };
});
