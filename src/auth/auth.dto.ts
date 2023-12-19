import { User } from '@prisma/client';

export class Login {
  access_token: string;
  refresh_token: string;
  user: User;
}

export class LoginRequestDto {
  username: string;
  password: string;
}

export class LogoutRequestDto {
  username: string;
}

export class Auth {
  status: boolean;
}

export class RefreshDto {
  refresh_token: string;
}

export interface Payload {
  sub: string;
  username: string;
}
