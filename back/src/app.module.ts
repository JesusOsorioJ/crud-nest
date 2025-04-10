import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'nozomi.proxy.rlwy.net',
      port: 49857,
      username: 'postgres',
      password: 'NqiFckQizrMliXezSSgiIPPYpguvmapr',
      database: 'railway',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo en desarrollo, usa migraciones en producción
    }),
    AuthModule,
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}
