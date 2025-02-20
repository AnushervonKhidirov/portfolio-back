import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { JwtEntity } from 'src/jwt/entity/jwt.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    name: 'created_at',
    type: 'bigint',
  })
  createdAt: number;

  @Column({
    name: 'updated_at',
    type: 'bigint',
  })
  updatedAt: number;

  @OneToMany(() => JwtEntity, (token) => token.user)
  token: JwtEntity;
}
