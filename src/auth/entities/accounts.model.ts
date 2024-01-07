import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { Role } from './role.enum';
import * as crypto from 'crypto';

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
}

export const AccountSchema = SchemaFactory.createForClass(Account);
