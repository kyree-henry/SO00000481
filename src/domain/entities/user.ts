import { Entity, Column } from "typeorm";
import { BaseEntity } from "../baseEntity";  
import { UserType } from "../enums";
 
@Entity()  
export class User extends BaseEntity {

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ default: true })
    isActive?: boolean;

    @Column({ type: 'timestamp', nullable: true })
    registeredOn: Date;

    @Column({ nullable: true })
    userName?: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    normalizedEmail?: string;

    @Column({ default: false })
    emailConfirmed: boolean;

    @Column({ nullable: true })
    passwordHash: string;

    @Column({ default: false })
    isLockedOut?: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lockoutEnd?: Date;

    @Column({ default: 0 })
    accessFailedCount: number;

    @Column({
        type: 'enum',
        enum: UserType,
        default: UserType.User,
    })
    type: UserType;

    constructor(request: Partial<User> = {}) {
        super();
        Object.assign(this, request);
        this.normalizedEmail = request.email.toUpperCase();
        this.registeredOn = new Date();
      } 
}
