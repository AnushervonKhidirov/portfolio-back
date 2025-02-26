import { HttpException } from '@nestjs/common';

export type TServiceMethodReturn<T> = [T, null] | [null, HttpException];
export type TServiceAsyncMethodReturn<T> = Promise<TServiceMethodReturn<T>>;
