import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class RefreshToken {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    jwt: string;

    @Column()
    userId: string;

    @Column()
    tokenValue: string;

    @Column()
    userAgent?: string;

    @Column()
    ipAddress?: string;

    @Column()
    deviceId?: string;

    @Column({ type: 'timestamp' })
    addedDateUtc: Date;
    
    @Column({ type: 'timestamp'  })
    expiryDateUtc: Date;
    
    constructor(partial?: Partial<RefreshToken>) {
        Object.assign(this, partial);
        this.id = uuidv4();
        this.addedDateUtc = new Date();
    }
 
}