"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosController = void 0;
const common_1 = require("@nestjs/common");
const todos_service_1 = require("./todos.service");
const create_todo_dto_1 = require("./dto/create-todo.dto");
const update_todo_dto_1 = require("./dto/update-todo.dto");
let TodosController = class TodosController {
    constructor(todosService) {
        this.todosService = todosService;
    }
    findAll() {
        return this.todosService.findAll();
    }
    create(createTodoDto) {
        return this.todosService.create(createTodoDto);
    }
    update(id, updateTodoDto) {
        return this.todosService.update(+id, updateTodoDto);
    }
    deleteCompleted() {
        return this.todosService.removeCompleted();
    }
    remove(id) {
        return this.todosService.remove(+id);
    }
    clearAll() {
        return this.todosService.removeAll();
    }
};
exports.TodosController = TodosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TodosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_todo_dto_1.CreateTodoDto]),
    __metadata("design:returntype", void 0)
], TodosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_todo_dto_1.UpdateTodoDto]),
    __metadata("design:returntype", void 0)
], TodosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('bulk-completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TodosController.prototype, "deleteCompleted", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TodosController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TodosController.prototype, "clearAll", null);
exports.TodosController = TodosController = __decorate([
    (0, common_1.Controller)('api/todos'),
    __metadata("design:paramtypes", [todos_service_1.TodosService])
], TodosController);
//# sourceMappingURL=todos.controller.js.map