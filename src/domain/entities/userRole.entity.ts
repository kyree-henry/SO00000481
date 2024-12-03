import { BaseEntity } from "../../domain/baseEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class UserRole extends BaseEntity {

  @Column()
  userId: string;

  @Column()
  roleId: string;

  constructor(request: Partial<UserRole> = {}) {
    super();
    Object.assign(this, request);
  }
}