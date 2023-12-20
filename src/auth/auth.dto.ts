import { User } from '@prisma/client';

export class Login {
  access_token: string;
  user: User;
}

export class LoginRequestDto {
  username: string;
  password: string;
}

export class Auth {
  status: boolean;
}

export class Payload {
  sub: string;
  username: string;
}

export class Profile {
  id: string;
  username: string;
}
