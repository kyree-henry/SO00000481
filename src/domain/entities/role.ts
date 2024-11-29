import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from "../baseEntity";
import { RoleClaim } from './roleClaim';

@Entity()
export class Role extends BaseEntity {

    @Column()
    name: string;

    @Column()
    description?: string;

    @Column()
    normalizedName: string;

    @OneToMany(() => RoleClaim, roleClaims => roleClaims.role)
    roleClaims: RoleClaim[];

    constructor(request: Partial<Role> = {}) {
        super();
        Object.assign(this, request);
        this.normalizedName = request.name.toUpperCase();
    }
} 