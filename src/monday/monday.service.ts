import { Injectable } from '@nestjs/common';
// import { HttpService,  Observable } from '@nestjs/axios';
// import { AxiosResponse, AxiosRequestConfig } from 'axios';

@Injectable()
export class MondayService {
  // constructor(private readonly httpService: HttpService) {}

  //   test(): Observable <AxiosResponse <any, any>> {
  //     // return this.httpService.get('http://localhost:3000/cats').then(( )=>{}).catch(()=>{});
  //     return this.httpService.post('http://localhost:3000/cats',);

  //   }
  postValidateMonday(challenge?: string) {
    // const requestUrl = ''
    const requestBody = JSON.stringify({
      challenge: `${challenge}`,
    });
    // const requestConfig: AxiosRequestConfig = {
    //     headers: {
    //       'Content-Type': 'YOUR_CONTENT_TYPE_HEADER',
    //     },
    //     params: {
    //       challenge: 'challenge'
    //     },
    //   };
    return requestBody;
    //   return this.httpService.post(requestUrl, requestBody, requestConfig).
    // send post request back to monday with the challenge
  }

  postStatusToWon(event?: any) {
    console.log('event', event);
    return event;
  }
}
