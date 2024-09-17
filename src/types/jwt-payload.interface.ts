import { UserRole } from 'src/auth/enums/role.enum';

export interface JwtPayload {
  sub: string;
  role: UserRole;
}
