import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @ApiProperty({ isArray: true, default: ['USER'] })
  @Column('simple-array')
  roles!: string[];

  @OneToMany(() => Task, task => task.user)
  tasks!: Task[];
}
