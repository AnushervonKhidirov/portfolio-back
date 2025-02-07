import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TokenEntity } from 'src/token/entity/token.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => TokenEntity, (token) => token.user)
  token: TokenEntity;
}
