import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'role',
})
export class RoleEntity {
  @PrimaryColumn()
  role_id: number;

  @Column()
  name?: string;
}
