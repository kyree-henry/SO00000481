import { RoleClaim } from './roleClaim.entity';
import { BaseEntity } from "../baseEntity";
import { RoleType } from '../enums';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class Role extends BaseEntity {

    @Column()
    name: string;

    @Column()
    description?: string;

    @Column()
    normalizedName: string;

    @Column({
        type: 'enum',
        enum: RoleType,
        default: RoleType.Regular,
    })
    type: RoleType;

    @OneToMany(() => RoleClaim, roleClaims => roleClaims.role)
    roleClaims: RoleClaim[];

    constructor(request: Partial<Role> = {}) {
        super();
        Object.assign(this, request);
        this.normalizedName = request.name?.toUpperCase();
    }
} 