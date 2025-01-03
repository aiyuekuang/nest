import { Module } from '@nestjs/common';
import { UserController } from "./controller/index.controller";
import { UserService } from "./services/user.service";
import { UserRepository } from "./repositories/user.repository";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService,UserRepository],
})
export class UserModule {}
