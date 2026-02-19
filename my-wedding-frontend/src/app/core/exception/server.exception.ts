import { logger } from '../utils/log.util';

export class ServerException extends Error {
  code?: number;
  phrase?: string;
  content?: any;

  constructor(error: any) {
    super(error.error.message);
    this.name = 'ServerResponseError';
    let message = error.error.message;
    if (message == null) {
      this.code = 500;
      this.phrase = 'Internal Server Error';
      this.message = 'Error desconocido, conecte con soporte.';
    } else {
      this.code = error.error.code;
      this.phrase = error.error.phrase;
      this.content = error.error.content;
    }
    logger.error(`[${this.code}/${this.phrase}] :: ${this.message}`);
  }
}
