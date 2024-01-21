import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Document } from 'mongoose';
import { Role } from './role.enum';
import { v4 as uuid } from 'uuid';
import * as crypto from 'crypto';

export type AccountDocument = Account & Document;

@Schema({
  timestamps: true,
  collection: 'accounts',
})
export class Account {
  @Prop({
    type: String,
    unique: true,
    default: function genUUID() {
      return uuid();
    },
  })
  @IsUUID()
  @IsNotEmpty()
  account_id: string;

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
  @IsNotEmpty()
  role: Role;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
