import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

const generateRandomEmail = (): string => {
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `e2e_${randomStr}@example.com`;
};

describe('App E2E (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const email = generateRandomEmail();
  const password = '123456';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
    await app.close();
  });

  it('/auth/register (POST) - Registro de usuario', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password,
      })
      .expect(HttpStatus.CREATED)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(email);
      });
  });

  it('/auth/login (POST) - Login de usuario', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(HttpStatus.OK)  
      .then((response) => {
        expect(response.body).toHaveProperty('access_token');
        token = response.body.access_token; 
      });
  });

  it('/tasks (POST) - Crear tarea', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'E2E Task',
        description: 'Task created via e2e test',
        status: 'IN_PROGRESS', 
        dueDate: '2025-04-15T00:00:00Z',
      })
      .expect(HttpStatus.CREATED)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('E2E Task');
      });
  });

  it('/tasks (GET) - Obtener tareas', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(Array.isArray(response.body.data)).toBe(true);
      });
  });

  it('/tasks/:id (PATCH) - Actualizar tarea', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Update Task',
        description: 'Before Update',
        status: 'DONE',
        dueDate: '2025-04-15T00:00:00Z',
      })
      .expect(HttpStatus.CREATED);

    const taskId = res.body.id;
    return request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Task',
        description: 'After update',
        status: 'IN_PROGRESS',
        dueDate: '2025-05-01T00:00:00Z',
      })
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body.title).toBe('Updated Task');
      });
  });

  it('/tasks/:id (DELETE) - Eliminar tarea', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Task to Delete',
        description: 'To be deleted',
        status: 'TODO',
        dueDate: '2025-04-15T00:00:00Z',
      })
      .expect(HttpStatus.CREATED);

    const taskId = res.body.id;
    return request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);
  });
});
