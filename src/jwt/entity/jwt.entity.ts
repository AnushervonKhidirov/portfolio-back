import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';

@Entity({ name: 'tokens' })
export class JwtEntity {
  @Column({ primary: true, name: 'refreshToken' })
  refreshToken: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.token)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
