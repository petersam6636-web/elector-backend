import {PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Entity, ManyToOne, JoinColumn} from 'typeorm';
import type { Users } from './user.entity.js';
import type { Likes } from './likes.entity.js';


@Entity('Nominees')
export class Nominees {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;


  @Column()
  lastName: string;

  @Column()
  description: string;

  @Column()
  menufestus: string;

  @ManyToOne('Users', (user: Users) => user.nominees)
  @JoinColumn({name: 'userId'})
  user: Users;

  @OneToMany('Likes', (like: Likes) => like.nominee)
  likes: Likes[];

  @CreateDateColumn()
  createdAt: Date
}