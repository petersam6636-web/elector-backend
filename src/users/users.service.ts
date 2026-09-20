  import { Injectable , ConflictException, NotFoundException, UnauthorizedException} from '@nestjs/common';
  import dayjs from 'dayjs';
  import { CreateUserDto } from './dto/create-user.dto.js';
  import { UpdateUserDto } from './dto/update-user.dto.js';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { compare } from 'bcrypt';
  import { Likes} from './entities/likes.entity.js';
  import { Users } from './entities/user.entity.js';
  import { Keys } from './entities/keys.entity.js';
  import { History } from './entities/history.entity.js';
  import { Nominees } from './entities/nominee.entity.js';
  import { LoginDto } from './dto/login.dto.js';
  import { nomineeDto } from './dto/nominee.dto.js';
import { LikesDto } from './dto/like.dto.js';
import { KeyDto } from './dto/key.dto.js';
import { HistoryDto } from './dto/history.dto.js';

  @Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,

    @InjectRepository(Nominees)
    private readonly nomineeRepo: Repository<Nominees>,

    @InjectRepository(Likes)
    private readonly likesRepo: Repository<Likes>,

    @InjectRepository(Keys)
    private readonly keysRepo: Repository<Keys>,

    @InjectRepository(History)
    private readonly historyRepo: Repository<History>,

  ){}

  async create(createUserDto: CreateUserDto) {
    const exist = await this.usersRepo.
    findOne({where: {email: createUserDto.email}});

    if(exist) throw new ConflictException('Email already exist');

    const user = this.usersRepo.create(createUserDto);
    await this.usersRepo.save(user);

    return {
      message: 'You have succeffully created account',
      state: true
    }
  }

  findAll() {
    return this.usersRepo.find();
  }

  async findOne(body: LoginDto) {

  const user = await this.usersRepo.findOne({
    where: {
      email: body.email,
    },
    relations: {
      key: true,
      history: true,
      nominees: {
        user: true,
        likes: {
          user: true
        }
      }
    }
  });

  if(!user) throw new NotFoundException('User with this email  do not exist');

  const isPassword = await compare(body.password, user.password);
  if(!isPassword) throw new UnauthorizedException('User password is not correct');


  return user
  }


  async createNominee(body: nomineeDto){

    const user = this.nomineeRepo.create({
      firstName: body.firstName,
      lastName: body.lastName,
      user: {
        id: body.userId
      },
      description: body.description,
      menufestus: body.menufesto,
    });

    await this.nomineeRepo.save(user);


    return {
      message: `You have successfully register ${body.firstName} ${body.lastName}`,
      state: true
    }
  }

  async findNominee(id: number){
    const user = await this.nomineeRepo.findOne({
      where: {
        id: id
      },
      relations: {
        likes: true,
        user: true
      }
    });
    if(!user) throw new NotFoundException('User not found');

    return  user
  }

  async addLike(body: LikesDto){


    const alreadyVoted = await this.usersRepo.findOne({
      where: {
        id: body.userId
      },
      relations: {
        like: true
      }
    });
    if (!alreadyVoted) throw new NotFoundException('User not found');
    if (alreadyVoted.like) throw new UnauthorizedException('You have already voted');

    const exist = await this.nomineeRepo.findOneBy({id: body.nomineeId});

    if(!exist) throw new NotFoundException('Nominee do not exist');

          const user =  this.likesRepo.create({
          userName: body.userName,
          comment: body.comment,
          nominee: {
            id: body.nomineeId
          },
          user: {
            id: body.userId
          }
        });

        await this.likesRepo.save(user);


        return {
          message: `You have successfully vote to this user`,
          state: true
        }
  }

  async findVote(){
 
    return this.likesRepo.find()
  }

 async addKey(body: KeyDto){

  const user = await this.usersRepo.findOne({
    where: {
      id: body.userId,
    },
    relations: {
      key: true
    }
  });
   

  if(user?.key) throw new UnauthorizedException('You already has chant')

    const now = dayjs();
    const expireTime = now.add(body.expireDate, 'hours').valueOf();

    const key = this.keysRepo.create({
      userKey: body.userKey,
      user: {
        id: body.userId,
      },
      expireDate: expireTime,
    });

    return this.keysRepo.save(key);
  }

  async findAllNominee(id: number){
   const contestants = await this.nomineeRepo.find({
    where: {
      user: {
        id: id
      }
    },
    relations: {
      likes: true
    }
   });

   contestants.sort((a, b) => b.likes.length - a.likes.length);
   return contestants
  }

 async addHistory(body: HistoryDto){
    const history = this.historyRepo.create({
      header: body.header,
      content: body.content,
      user: {
        id: body.userId
      }
    });

   await this.historyRepo.save(history);
   await this.nomineeRepo.delete({user: {id: body.userId}});
   await this.likesRepo.delete({user: {id: body.userId}});
   await this.keysRepo.delete({user: {id: body.userId}});



    return this.historyRepo.find()
  }


clear(id: number){
 return this.historyRepo.delete({
  user: {
    id: id
  }
 })
}

remove(id: number){
 return this.historyRepo.delete({
  id: id
 })
}



}
