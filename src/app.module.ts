import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      useFactory: (configService: ConfigService): Object => ({
        type: 'sqlite',
        database: 'db.sqlite',
        autoLoadEntities: configService.getOrThrow<string>('ENTITIES'),
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    UsersModule
  ],
})
export class AppModule {}
