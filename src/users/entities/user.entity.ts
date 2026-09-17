import {
  PrimaryGeneratedColumn, Column,
   CreateDateColumn, BeforeInsert, Entity, OneToOne,
    OneToMany
  } from 'typeorm';
import {hash} from  'bcrypt';
import type { Nominees } from './nominee.entity.js';
import type { Keys } from './keys.entity.js';
import type { History } from './history.entity.js';
import type { Likes } from './likes.entity.js';

@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany('Nominees', (nominee: Nominees) => nominee.user)
  nominees: Nominees[];

  @OneToOne('Keys', (key: Keys) => key.user)
  key: Keys;

  @OneToOne('Likes', (like: Likes) => like.user)
  like: Likes;

  @OneToMany('History', (history: History) => history.user)
  history: History[];

  @CreateDateColumn()
  createdAt:  Date;

  @BeforeInsert()
  async hashPassword(){
    this.password = await hash(this.password, 10);
  }
}
