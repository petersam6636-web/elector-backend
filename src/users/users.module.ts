import {Module} from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Likes} from './entities/likes.entity.js';
import { Users } from './entities/user.entity.js';
import { Keys } from './entities/keys.entity.js';
import { History } from './entities/history.entity.js';
import { Nominees } from './entities/nominee.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Likes, Users, Keys, History, Nominees])],
  controllers: [UsersController],
  providers: [UsersService]
})

export class UsersModule {}