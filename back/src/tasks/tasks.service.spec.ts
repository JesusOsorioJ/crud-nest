import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: Partial<Repository<Task>>;

  beforeEach(async () => {
    const tasks: Task[] = [];
    tasksRepository = {
      create: jest.fn().mockImplementation((dto) => ({ ...dto })),
      save: jest.fn().mockImplementation((entity) => {
        entity.id = tasks.length + 1;
        tasks.push(entity);
        return Promise.resolve(entity);
      }),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(tasks),
      }),
      findOne: jest.fn().mockImplementation(({ where: { id } }) => {
        const task = tasks.find((t) => t.id === id);
        return Promise.resolve(task);
      }),
      delete: jest.fn().mockImplementation((id) => Promise.resolve({ affected: 1 })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: tasksRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        dueDate: '2025-04-15T00:00:00Z',
      };
      const user: User = { id: 1, email: 'user@test.com', password: 'secret', roles: ['USER'], tasks: [] };

      const task = await tasksService.create(createTaskDto, user);
      expect(task).toHaveProperty('id');
      expect(task.title).toEqual(createTaskDto.title);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if task does not exist', async () => {
      await expect(tasksService.findOne(999, { id: 1 } as User)).rejects.toThrow(NotFoundException);
    });
  });
});
