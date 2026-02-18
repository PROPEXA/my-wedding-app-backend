import { URL } from '../env/env.dev';
import { ResponseServer } from '../model/response.mode';
import { logger } from '../utils/log.util';

export class ServerException extends Error {
  constructor(
    responseServer: ResponseServer,
    public code = responseServer.code,
    public phrase = responseServer.phrase,
    public content = responseServer.content,
  ) {
    super(responseServer.message);
    this.name = 'ServerResponseError';
    if (URL.showLog) {
      logger.error(`[${this.code}/${this.phrase}] :: ${this.message}`);
    }
  }
}
