import {PrimaryGeneratedColumn,
   Column, CreateDateColumn, Entity, OneToOne, JoinColumn} from 'typeorm';
import type { Users } from './user.entity.js';

@Entity('Keys')
export class Keys {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userKey: string;

  @Column({type: 'bigint'})
  expireDate: number;

  @OneToOne('Users', (user: Users) => user.key)
  @JoinColumn({name: 'userId'})
  user: Users

  @CreateDateColumn()
  createdAt: Date
}