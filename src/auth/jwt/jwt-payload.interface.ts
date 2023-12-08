import { UserType } from '@prisma/client';

export interface JwtPayload {
  id: string;
  username: string;
  userType: UserType;
}
