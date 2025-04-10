import {
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
  })
  export class TaskGateway {
    @WebSocketServer()
    server!: Server;
  
    emitTaskCreated(task: any) {
      this.server.emit('taskCreated', task);
    }
  
    emitTaskUpdated(task: any) {
      this.server.emit('taskUpdated', task);
    }
  }
  