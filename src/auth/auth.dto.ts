import { User } from '@prisma/client';

export class Login {
  access_token: string;
  user: User;
}
