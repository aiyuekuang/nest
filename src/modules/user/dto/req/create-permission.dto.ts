import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  sign: string;

  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? null : value))
  parentId: string | null;

  @IsNotEmpty()
  @IsNumber()
  sort: number;

  constructor(user: any) {
    Object.assign(this as any, user);
  }
}
