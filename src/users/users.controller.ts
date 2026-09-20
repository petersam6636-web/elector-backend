import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import {LoginDto} from './dto/login.dto.js';
import { nomineeDto } from './dto/nominee.dto.js';
import { LikesDto } from './dto/like.dto.js';
import { KeyDto } from './dto/key.dto.js';
import { HistoryDto } from './dto/history.dto.js';
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

  @Post('login')
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

  @Get('nominees/:id')
  findAllNominee(@Param('id', ParseIntPipe) id: number){
    return this.usersService.findAllNominee(id)
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

  @Post('history')
  history(@Body() body: HistoryDto){
    return this.usersService.addHistory({
      header: body.header,
      content: body.content,
      userId: Number(body.userId)
    })
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number){
    return this.usersService.clear(id)
  }
  @Delete('history/:id')
  remove(@Param('id', ParseIntPipe) id: number){
    return this.usersService.remove(id)
  }
}
