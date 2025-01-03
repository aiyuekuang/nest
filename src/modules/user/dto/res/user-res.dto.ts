// src/modules/user/dto/res/user-res.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class UserResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
  }
}
