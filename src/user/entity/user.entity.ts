import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TokenEntity } from 'src/token/entity/token.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => TokenEntity, (token) => token.user)
  token: TokenEntity;
}
