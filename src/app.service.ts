import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): {
    status: number;
    message: string;
  } {
    return {
      status: HttpStatus.OK,
      message: 'OK',
    };
  }
}
