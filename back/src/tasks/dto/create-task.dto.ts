import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.TODO })
  @IsEnum(TaskStatus)
  status!: TaskStatus;

  @ApiProperty()
  @IsDateString()
  dueDate!: string;

  @ApiPropertyOptional({ description: 'Nombre del archivo de imagen adjunta' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
