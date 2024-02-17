import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Role } from '../../domain/role';

@Entity({
  name: 'role',
})
export class RoleEntity implements Role {
  @PrimaryColumn()
  id: number;

  @Column()
  name?: string;
}
