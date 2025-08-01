import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorsDebugMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🌐 CORS Debug Info:');
      console.log('Origin:', req.headers.origin);
      console.log('Method:', req.method);
      console.log('URL:', req.url);
      console.log('User-Agent:', req.headers['user-agent']);
      console.log('---');
    }
    next();
  }
}
