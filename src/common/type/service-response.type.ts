import { HttpException } from '@nestjs/common';

export type TServiceResponse<T> = Promise<[T | null, HttpException | null]>;
