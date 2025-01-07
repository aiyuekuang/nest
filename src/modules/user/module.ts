import { Module } from '@nestjs/common';
import { UserController } from "./controller/index.controller";
import { UserService } from "./services/user.service";
import { User } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
