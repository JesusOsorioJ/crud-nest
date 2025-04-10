import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UsersModule } from '../users/users.module';
import { TaskGateway } from './task.gateway';


@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule],
  controllers: [TasksController],
  providers: [TasksService, TaskGateway],
  exports: [TaskGateway],
})
export class TasksModule {}
