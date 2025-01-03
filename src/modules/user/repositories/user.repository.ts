// src/modules/user/repositories/user.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Injectable } from "@nestjs/common";

@EntityRepository(User)
@Injectable()
export class UserRepository extends Repository<User> {}
