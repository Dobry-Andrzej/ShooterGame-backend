import {Language} from "./translate";

export enum UserRole {
  Admin,
  Moderator,
  User,
}

export enum Permission {
  DeleteInitiative,
  UpdateInitiative,
  AcceptInitiative,
  RejectInitiative,
  UpdateUserProfile,
}

export interface ResetPassRequest {
  password: string;
  userId: string;
  updateToken: string;
}

export interface UserSoftData {
  id: string;
  email: string;
  tel: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  photoFn: string;
  accountCreatedDt: Date;
  lastLoginDt: Date;
  language: Language;
}