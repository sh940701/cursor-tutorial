import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
export declare class TodosController {
    private readonly todosService;
    constructor(todosService: TodosService);
    findAll(): import("./entities/todo.entity").Todo[];
    create(createTodoDto: CreateTodoDto): import("./entities/todo.entity").Todo;
    update(id: string, updateTodoDto: UpdateTodoDto): import("./entities/todo.entity").Todo;
    deleteCompleted(): {
        message: string;
    };
    remove(id: string): void;
    clearAll(): {
        message: string;
    };
}
