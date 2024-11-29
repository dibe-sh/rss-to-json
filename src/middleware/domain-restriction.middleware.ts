import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DomainRestrictionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedDomain = ['dibe.sh', 'localhost'];
    if (!allowedDomain.includes(req.hostname)) {
      return res.status(403).send('Forbidden');
    }
    next();
  }
}
