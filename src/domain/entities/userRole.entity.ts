import { BaseEntity } from "../../domain/baseEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class UserRole extends BaseEntity {

  @Column()
  userId: string;

  @Column()
  roleId: string;

  @Column({ default: false })
  isDisabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  disabledUntil?: Date;

  constructor(request: Partial<UserRole> = {}) {
    super();
    Object.assign(this, request);
  }
}