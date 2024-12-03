import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './role.entity';

@Entity()
export class RoleClaim {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    roleId: string;

    @Column()
    claimType: string;

    @Column()
    claimValue: string;

    @ManyToOne(() => Role, role => role.roleClaims)
    role!: Role[];

    constructor(request: Partial<RoleClaim> = {}) {
        Object.assign(this, request);
        this.id = uuidv4();
    }


}