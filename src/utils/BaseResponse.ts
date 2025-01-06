// src/utils/BaseResponse.ts
export class BaseResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
