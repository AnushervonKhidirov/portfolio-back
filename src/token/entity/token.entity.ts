import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';

@Entity({ name: 'tokens' })
export class TokenEntity {
  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'user_id', primary: true })
  userId: string;

  @OneToOne(() => UserEntity, (user) => user.token)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
