import { IsString, IsInt, Min, Max, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsInt()
  @Min(1)
  @Max(5)
  priority: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  description?: string;
} 