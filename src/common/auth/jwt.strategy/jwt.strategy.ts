import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    const domain = process.env.AUTH0_DOMAIN;
    const audience = process.env.AUTH0_AUDIENCE;

    if (!domain || !audience) {
      throw new Error(
        'As variáveis de ambiente AUTH0_DOMAIN e AUTH0_AUDIENCE não foram definidas.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }),
      audience: audience,
      issuer: `https://${domain}/`,
      algorithms: ['RS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    if (!payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return payload;
  }
}
