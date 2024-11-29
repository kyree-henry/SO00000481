import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    createdBy?: string;

    @CreateDateColumn()
    createdOn: Date;

    @Column({ nullable: true })
    lastModifiedBy?: string;

    @UpdateDateColumn({ nullable: true })
    lastModifiedOn?: Date;

    @Column()
    lastRefreshed: Date;

    constructor() {
        this.id = uuidv4();
        this.createdOn = new Date();
        this.lastRefreshed = new Date();
    }

    setCreatedBy(user: string) {
        this.createdBy = user;
    }

    setLastModifiedBy(user: string) {
        this.lastModifiedBy = user;
        this.lastModifiedOn = new Date();
    }
}