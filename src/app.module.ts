import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { GanttModule } from './gantt-event/gantt.module';
import { GanttProjectModule } from './gantt-project/gantt-project.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    GanttModule,
    GanttProjectModule,
    UserModule,
  ],
})
export class AppModule {}
