import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Entity()
export class Task {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  title!: string;

  @ApiProperty()
  @Column()
  description!: string;

  @ApiProperty({ enum: TaskStatus })
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status!: TaskStatus;

  @ApiProperty()
  @Column('timestamp')
  dueDate!: Date;

  @ApiPropertyOptional({ description: 'Nombre o URL de la imagen adjunta' })
  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => User, user => user.tasks, { eager: true })
  user!: User;
}
