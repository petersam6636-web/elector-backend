import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import {LoginDto} from './dto/login.dto.js';
import { nomineeDto } from './dto/nominee.dto.js';
import { LikesDto } from './dto/like.dto.js';
import { KeyDto } from './dto/key.dto.js';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('login')
  findOne(@Body() body: LoginDto ) {
    return this.usersService.findOne(body);
  }

  @Post('register')
  register(@Body() body: nomineeDto){
      return this.usersService.createNominee({
        firstName: body.firstName,
        lastName: body.lastName,
        description: body.description,
        menufesto: body.menufesto,
        userId: Number(body.userId)
      })
  }


  @Get('nominee/:id')
  findNominee(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findNominee(id)
  }

  @Post('vote')
  addVote(@Body() body: LikesDto){
    return this.usersService.addLike({
      userName: body.userName,
      comment: body.comment,
      userId: Number(body.userId),
      nomineeId: Number(body.nomineeId)
    });
  }

  @Get('vote')
  findVote(){
    return this.usersService.findVote()
  }

  @Post('register/key')
  addKey(@Body() key: KeyDto){
    return this.usersService.addKey(key)
  }
}
