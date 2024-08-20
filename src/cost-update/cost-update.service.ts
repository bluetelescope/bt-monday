import { Injectable, Logger } from '@nestjs/common';
// import { HttpService,  Observable } from '@nestjs/axios';
// import { AxiosResponse, AxiosRequestConfig } from 'axios';

@Injectable()
export class CostUpdateService {
  private readonly logger = new Logger(CostUpdateService.name);

  postMonday(challenge?: string) {
    const requestBody = JSON.stringify({
      challenge: `${challenge}`,
    });
    this.logger.log('postValidateMonday running...');

    return requestBody;
  }
}
