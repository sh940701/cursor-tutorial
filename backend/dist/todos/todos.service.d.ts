import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
export declare class TodosService {
    private todos;
    private idCounter;
    findAll(): Todo[];
    findOne(id: number): Todo;
    create(createTodoDto: CreateTodoDto): Todo;
    update(id: number, updateTodoDto: UpdateTodoDto): Todo;
    remove(id: number): void;
    removeAll(): {
        message: string;
    };
    removeCompleted(): {
        message: string;
    };
}
