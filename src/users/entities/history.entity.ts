import {PrimaryGeneratedColumn,
   Column, CreateDateColumn, Entity, ManyToOne, JoinColumn} from 'typeorm';
import type { Users } from './user.entity.js';

@Entity('History')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  header: number;
  

  @Column()
  content: number;

  @ManyToOne('Users', (user: Users) => user.history)
  @JoinColumn({name: 'userId'})
  user: Users

  @CreateDateColumn()
  createdAt: Date
}