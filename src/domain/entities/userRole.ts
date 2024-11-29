import { Column, Entity } from "typeorm";

@Entity()
export class UserRole {

    @Column()
    userId: string;

    @Column()
    roleId: string;
 
    constructor(request: Partial<UserRole> = {}) { 
        Object.assign(this, request); 
      } 
}