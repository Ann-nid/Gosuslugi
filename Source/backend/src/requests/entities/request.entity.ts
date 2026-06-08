import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('service_requests')
export class ServiceRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'service_id' })
  serviceId: number;

  @Column({ name: 'request_date', default: () => 'GETDATE()' })
  requestDate: Date;

  @Column()
  status: string;

  @Column({ nullable: true })
  comment: string;
}

