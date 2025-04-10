import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { User } from '../users/entities/user.entity';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@ApiTags('tasks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Endpoint para crear una tarea con posibilidad de subir un archivo
  @ApiOperation({ summary: 'Crear tarea con imagen' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Datos de la tarea junto con el archivo de imagen (campo "image")',
    type: CreateTaskDto,
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
        },
      }),
    }),
  )
  async createWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: RequestWithUser,
  ) {
    if (file) {
      createTaskDto.imageUrl = file.filename;
    }
    return this.tasksService.create(createTaskDto, req.user);
  }

  // Endpoint estándar de creación sin archivo
  @ApiOperation({ summary: 'Crear tarea sin imagen' })
  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.create(createTaskDto, req.user);
  }

  @ApiOperation({ summary: 'Obtener tareas' })
  @Get()
  async findAll(@Request() req: RequestWithUser, @Query() filters: any) {
    return this.tasksService.findAll(req.user, filters);
  }

  @ApiOperation({ summary: 'Obtener tarea por ID' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.tasksService.findOne(+id, req.user);
  }

  @ApiOperation({ summary: 'Actualizar tarea' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.update(+id, updateTaskDto, req.user);
  }

  @ApiOperation({ summary: 'Eliminar tarea' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.tasksService.remove(+id, req.user);
  }
}
