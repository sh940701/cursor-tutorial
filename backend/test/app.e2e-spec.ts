import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TodosService } from '../src/todos/todos.service';

describe('Todos E2E', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
    server = app.getHttpServer();
  });
  
  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const todosService = app.get(TodosService);
    await todosService.removeAll();
  });

  describe('GET /api/todos', () => {
    it('should return an empty array initially', () => {
      return request(server).get('/api/todos').expect(200).expect([]);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo and return it', async () => {
      const createDto = { text: 'E2E Test Todo', priority: 4 };
      const res = await request(server)
        .post('/api/todos')
        .send(createDto)
        .expect(201);
      
      expect(res.body).toEqual({
        id: expect.any(Number),
        completed: false,
        createdAt: expect.any(String),
        ...createDto
      });
    });
    
    it('should return 400 for invalid data (missing priority)', () => {
      return request(server)
        .post('/api/todos')
        .send({ text: 'Invalid' })
        .expect(400);
    });
  });

  describe('API with existing data', () => {
    let createdTodo;

    beforeEach(async () => {
      const createDto = { text: 'Test Me', priority: 1 };
      const res = await request(server).post('/api/todos').send(createDto);
      createdTodo = res.body;
    });

    it('PUT /api/todos/:id -> should update the todo', async () => {
      const updateDto = { text: 'Updated Text', completed: true };
      const res = await request(server)
        .put(`/api/todos/${createdTodo.id}`)
        .send(updateDto)
        .expect(200);

      expect(res.body.text).toBe('Updated Text');
      expect(res.body.completed).toBe(true);
    });

    it('DELETE /api/todos/:id -> should delete the todo', async () => {
      await request(server)
        .delete(`/api/todos/${createdTodo.id}`)
        .expect(204);
      
      const res = await request(server).get('/api/todos');
      expect(res.body).toHaveLength(0);
    });
    
    it('GET /api/todos/:id -> should return 404 for a non-existent todo', () => {
        return request(server)
            .get(`/api/todos/9999`)
            .expect(404);
    });
    
    it('DELETE /api/todos/bulk-completed -> should delete only completed todos', async () => {
        const incompleteDto = { text: 'Incomplete', priority: 3 };
        await request(server).post('/api/todos').send(incompleteDto);
        
        const resToComplete = await request(server).post('/api/todos').send({text: 'to complete', priority: 1});
        await request(server).put(`/api/todos/${resToComplete.body.id}`).send({completed: true});

        await request(server)
            .delete('/api/todos/bulk-completed')
            .expect(200);

        const allTodosRes = await request(server).get('/api/todos');
        expect(allTodosRes.body).toHaveLength(2);
        expect(allTodosRes.body.every(t => !t.completed)).toBe(true);
    });

    it('DELETE /api/todos -> should delete all todos', async () => {
        await request(server).post('/api/todos').send({text: 'another todo', priority: 1});
        await request(server).delete('/api/todos').expect(200);
        
        const res = await request(server).get('/api/todos');
        expect(res.body).toHaveLength(0);
    });
  });
});
