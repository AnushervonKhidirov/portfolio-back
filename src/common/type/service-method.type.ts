import { HttpException } from '@nestjs/common';

export type TServiceMethodReturn<T> = [T | null, HttpException | null]
export type TServiceAsyncMethodReturn<T> = Promise<TServiceMethodReturn<T>>;
