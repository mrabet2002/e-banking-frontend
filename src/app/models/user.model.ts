import { Role } from './enums/role.enum';
export interface User {
  username: string;
  name: string;
  role: Role | '';
}
