import { Injectable, Logger } from '@nestjs/common';
// import { HttpService,  Observable } from '@nestjs/axios';
// import { AxiosResponse, AxiosRequestConfig } from 'axios';

@Injectable()
export class MondayService {
  private readonly logger = new Logger(MondayService.name);

  postMonday(challenge?: string) {
    const requestBody = JSON.stringify({
      challenge: `${challenge}`,
    });
    this.logger.log('postValidateMonday running...');

    return requestBody;
  }
}
// constructor(private readonly httpService: HttpService) {}

//   test(): Observable <AxiosResponse <any, any>> {
//     // return this.httpService.get('http://localhost:3000/cats').then(( )=>{}).catch(()=>{});
//     return this.httpService.post('http://localhost:3000/cats',);

//   }

// postValidateMonday(challenge?: string) {
//   const requestBody = JSON.stringify({
//     challenge: `${challenge}`,
//   });
//   this.logger.log('postValidateMonday running...');

//   return requestBody;
// }

// postStatusToWon(data?: any) {
//   this.logger.log('postStatusToWon running...');
//   this.logger.log(data);

//   return 'testing';
// }
