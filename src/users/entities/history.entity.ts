import {PrimaryGeneratedColumn,
   Column, CreateDateColumn, Entity, ManyToOne, JoinColumn} from 'typeorm';
import type { Users } from './user.entity.js';

@Entity('History')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  header: string;
  

  @Column()
  content: string;

  @ManyToOne('Users', (user: Users) => user.history)
  @JoinColumn({name: 'userId'})
  user: Users

  @CreateDateColumn()
  createdAt: Date
}