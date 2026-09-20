import {PrimaryGeneratedColumn,
  Column, CreateDateColumn, Entity, OneToOne,ManyToOne,
   JoinColumn} from 'typeorm';
import type { Nominees } from './nominee.entity.js';
import type { Users } from './user.entity.js';

@Entity('Likes')
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  comment: string;

  @OneToOne('Users', (user: Users) => user.like)
  @JoinColumn({name: 'userId'})
  user: Users;

  @ManyToOne('Nominees', (nominee: Nominees) => nominee.likes)
  @JoinColumn({name: 'nomineeId'})
  nominee: Nominees

  @CreateDateColumn()
  createdAt: Date
}