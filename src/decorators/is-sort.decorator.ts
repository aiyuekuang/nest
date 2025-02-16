// src/decorators/skip-auth.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_SORT_FIELD = 'isSortField';
export const IsSortField = () => SetMetadata(IS_SORT_FIELD, true);
