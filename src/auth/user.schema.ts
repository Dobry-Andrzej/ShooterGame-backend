import * as bcrypt from 'bcryptjs';
import { UserRole } from '../../utils/types';
import { Language } from '../../utils/translate';
import { Document } from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';

@Schema()
export class User extends Document {

  @Prop({ unique: true, strength: 2, locale: 'en', trim: true, lowercase: true, type: String, maxlength: [50, 'too_long_email'] })
  email: string;

  @Prop({ select: false, type: String })
  password: string;

  @Prop({ required: true, type: String, maxlength: [40, 'too_long_first_name']})
  firstName: string;

  @Prop({ required: true, type: String, maxlength: [40, 'too_long_last_name']})
  lastName: string;

  @Prop({ type: String })
  photoFn: string;

  @Prop({ default: null, unique: true })
  tel: string;

  @Prop({ required: true })
  role: UserRole;

  @Prop({ type: String, select: false })
  salt: string;

  @Prop({ default: Date.now })
  lastLoginDt: Date;

  @Prop({ default: null })
  accountCreatedDt: Date;

  @Prop({ type: String })
  currentTokenId: string;

  @Prop({ type: String })
  changePassToken: string;

  @Prop()
  changePassTokenValidTill: Date;

  @Prop({ type: String })
  updateToken: string;

  @Prop({ default: Language.pl })
  language: Language;
}

export const UserSchema = SchemaFactory.createForClass(User);
