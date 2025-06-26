import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

const mockTodo: Todo = {
  id: 1,
  text: 'Test Todo',
  completed: false,
  priority: 3,
  createdAt: new Date().toISOString(),
};

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  const mockTodosService = {
    create: jest.fn().mockImplementation((dto: CreateTodoDto) => ({
      id: Date.now(),
      ...dto,
      completed: false,
      createdAt: new Date().toISOString(),
    })),
    findAll: jest.fn().mockReturnValue([mockTodo]),
    update: jest.fn().mockImplementation((id: number, dto: UpdateTodoDto) => ({
      id,
      ...mockTodo,
      ...dto,
    })),
    remove: jest.fn().mockImplementation((id: number) => undefined),
    removeAll: jest.fn().mockReturnValue({ message: 'All todos have been deleted.' }),
    removeCompleted: jest.fn().mockReturnValue({ message: '1 completed todos have been deleted.' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a todo', () => {
    const dto: CreateTodoDto = { text: 'New Todo', priority: 1 };
    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      completed: false,
      createdAt: expect.any(String),
      ...dto,
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should get all todos', () => {
    expect(controller.findAll()).toEqual([mockTodo]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should update a todo', () => {
    const dto: UpdateTodoDto = { text: 'Updated Todo' };
    expect(controller.update('1', dto)).toEqual({
      id: 1,
      ...mockTodo,
      ...dto,
    });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a todo', () => {
    controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should remove all todos', () => {
    expect(controller.clearAll()).toEqual({ message: 'All todos have been deleted.' });
    expect(service.removeAll).toHaveBeenCalled();
  });

  it('should remove all completed todos', () => {
    expect(controller.deleteCompleted()).toEqual({ message: '1 completed todos have been deleted.' });
    expect(service.removeCompleted).toHaveBeenCalled();
  });
});
