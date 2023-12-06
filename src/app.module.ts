import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GanttModule } from './gantt-event/gantt.module';
import { GanttProjectModule } from './gantt-project/gantt-project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    GanttModule,
    GanttProjectModule,
  ],
})
export class AppModule { }
