import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { TaskGateway } from './task.gateway';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private taskGateway: TaskGateway,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({ ...createTaskDto, user });
    this.taskGateway.emitTaskCreated(task);
    return this.taskRepository.save(task);
  }

  async findAll(user: User, filters: any): Promise<any> {
    const query = this.taskRepository.createQueryBuilder('task');
    const queryAll = this.taskRepository.createQueryBuilder('task');


    // Si el usuario no es ADMIN, filtrar solo sus tareas
    if (!user.roles.includes('ADMIN')) {
      query.where('task.userId = :userId', { userId: user.id });
      queryAll.where('task.userId = :userId', { userId: user.id });
    }

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.dueDate) {
      query.andWhere('DATE(task.dueDate) = DATE(:dueDate)', { dueDate: filters.dueDate });
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    query.skip((page - 1) * limit).take(limit);

    const response = await query.getMany();
    const responseAll = await queryAll.getMany();


    return {
      totalItems : responseAll.length,
      totalPages: Math.ceil(responseAll.length/limit),
      data : response
    }
  }

  async findOne(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task con id ${id} no encontrada`);
    }
    // Usuario USER solo puede acceder a sus propias tareas
    if (!user.roles.includes('ADMIN') && task.user.id !== user.id) {
      throw new NotFoundException(`Task con id ${id} no encontrada`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    this.taskGateway.emitTaskUpdated(task);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: number, user: User): Promise<void> {
    const task = await this.findOne(id, user);
    await this.taskRepository.delete(task.id);
  }
}
