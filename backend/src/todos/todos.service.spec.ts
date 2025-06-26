import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodosService],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new todo', () => {
      const createTodoDto: CreateTodoDto = { text: 'Test Todo', priority: 3 };
      const newTodo = service.create(createTodoDto);
      expect(newTodo).toEqual({
        id: 1,
        text: 'Test Todo',
        priority: 3,
        completed: false,
        createdAt: expect.any(String),
      });
      expect(service.findAll()).toHaveLength(1);
    });
  });

  describe('findAll()', () => {
    it('should return an array of todos', () => {
      service.create({ text: 'Todo 1', priority: 1 });
      service.create({ text: 'Todo 2', priority: 2 });
      expect(service.findAll()).toHaveLength(2);
    });

    it('should return an empty array if no todos exist', () => {
      expect(service.findAll()).toEqual([]);
    });
  });

  describe('findOne()', () => {
    it('should return a single todo', () => {
      const newTodo = service.create({ text: 'Find Me', priority: 5 });
      const foundTodo = service.findOne(newTodo.id);
      expect(foundTodo).toEqual(newTodo);
    });

    it('should throw a NotFoundException if todo does not exist', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update a todo', () => {
      const newTodo = service.create({ text: 'Original Text', priority: 1 });
      const updateTodoDto: UpdateTodoDto = { text: 'Updated Text', completed: true };
      const updatedTodo = service.update(newTodo.id, updateTodoDto);
      
      expect(updatedTodo.text).toBe('Updated Text');
      expect(updatedTodo.completed).toBe(true);
    });

    it('should throw a NotFoundException if todo to update does not exist', () => {
      const updateTodoDto: UpdateTodoDto = { text: 'Does not matter' };
      expect(() => service.update(999, updateTodoDto)).toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should remove a todo', () => {
      const todo1 = service.create({ text: 'Todo 1', priority: 1 });
      service.create({ text: 'Todo 2', priority: 2 });
      
      service.remove(todo1.id);
      expect(service.findAll()).toHaveLength(1);
      expect(() => service.findOne(todo1.id)).toThrow(NotFoundException);
    });

    it('should throw a NotFoundException if todo to remove does not exist', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
    });
  });

  describe('removeAll()', () => {
    it('should remove all todos', () => {
      service.create({ text: 'Todo 1', priority: 1 });
      service.create({ text: 'Todo 2', priority: 2 });
      
      const result = service.removeAll();
      expect(service.findAll()).toHaveLength(0);
      expect(result.message).toBe('All todos have been deleted.');
    });
  });

  describe('removeCompleted()', () => {
    it('should remove all completed todos', () => {
      service.create({ text: 'Incomplete Todo', priority: 1 });
      const completedTodo1 = service.create({ text: 'Completed 1', priority: 2 });
      const completedTodo2 = service.create({ text: 'Completed 2', priority: 3 });

      service.update(completedTodo1.id, { completed: true });
      service.update(completedTodo2.id, { completed: true });

      const result = service.removeCompleted();
      expect(service.findAll()).toHaveLength(1);
      expect(service.findAll()[0].text).toBe('Incomplete Todo');
      expect(result.message).toBe('2 completed todos have been deleted.');
    });
  });
});
