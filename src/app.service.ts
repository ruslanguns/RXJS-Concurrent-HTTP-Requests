import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  catchError,
  forkJoin,
  lastValueFrom,
  map,
  Observable,
  of,
  tap,
} from 'rxjs';

@Injectable()
export class AppService {
  apiUrl = 'https://61e6b4ca128d81c06075fbe528cede83.m.pipedream.net';

  peticion1$: Observable<any> = this.http.get(this.apiUrl + 's').pipe(
    map(({ data }) => data),
    tap(() => console.log('peticion1 ejecutada')),
    catchError((err) => {
      console.log('peticion1 ejecutada con error');
      // return throwError(() => err);
      return of(err);
    }),
  );

  peticion2$: Observable<any> = this.http.get(this.apiUrl).pipe(
    map(({ data }) => data),
    tap(() => console.log('peticion2 ejecutada')),
    catchError((err) => {
      console.log('peticion2 ejecutada con error');
      return of(err);
    }),
  );

  constructor(private readonly http: HttpService) {}

  async getHello() {
    const requests$ = forkJoin({
      peticion1: this.peticion1$,
      peticion2: this.peticion2$,
    }).pipe(
      tap(({ peticion1, peticion2 }) => {
        console.log('Resultado de peticion1:', peticion1 instanceof Error);
        console.log('Resultado de peticion2:', peticion2 instanceof Error);
      }),
    );

    return await lastValueFrom(requests$);

    // const peticion1 = await lastValueFrom(this.peticion1$);
    // const peticion2 = await lastValueFrom(this.peticion2$);

    // return {
    //   peticion1,
    //   peticion2,
    // };
  }
}
