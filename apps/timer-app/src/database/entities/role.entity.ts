import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Role } from '../domain/role';

@Entity({
  name: 'role',
})
export class RoleEntity implements Role {
  @PrimaryColumn()
  role_id: number;

  @Column()
  name?: string;
}
