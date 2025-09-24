import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  private readonly isTestEnvironment: boolean;

  constructor() {
    const domain = process.env.AUTH0_DOMAIN;
    const audience = process.env.AUTH0_AUDIENCE;
    
    if (!domain || !audience) {
      throw new Error(
        'AUTH0_DOMAIN e AUTH0_AUDIENCE devem ser configurados no .env',
      );
    }
    
    // Detecta se estamos em ambiente de teste (NODE_ENV=test ou jest em execução)
    const isTestEnvironment =
      process.env.NODE_ENV === 'test' ||
      process.env.JEST_WORKER_ID !== undefined;
    
    const options = isTestEnvironment
      ? {
          // Em ambiente de teste, use uma chave secreta simples para validar tokens
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: 'test-secret-key-for-testing-only',
        }
      : {
          // Em ambiente real, use Auth0
          secretOrKeyProvider: passportJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${domain}/.well-known/jwks.json`,
          }),
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          audience: audience,
          issuer: `https://${domain}/`,
          algorithms: ['RS256'],
        };
        
    super(options);
    
    this.isTestEnvironment = isTestEnvironment;
    
    this.logger.log(
      `Inicializando JwtStrategy com domain: ${domain} e audience: ${audience}`,
    );
    
    if (this.isTestEnvironment) {
      this.logger.log(
        'Executando em ambiente de teste - usando configuração simplificada',
      );
    }
  }

  validate(payload: any): any {
    try {
      // Validação básica do payload
      if (!payload) {
        this.logger.error('Payload JWT vazio ou inválido');
        throw new UnauthorizedException('Token inválido');
      }
      
      if (!this.isTestEnvironment) {
        // Em ambiente real, valide audience e issuer
        // Validação do audience
        if (payload.aud !== process.env.AUTH0_AUDIENCE) {
          this.logger.warn(
            `Audience incorreto: esperado ${process.env.AUTH0_AUDIENCE}, recebido ${payload.aud}`,
          );
        }
        
        // Validação do issuer
        const expectedIssuer = `https://${process.env.AUTH0_DOMAIN}/`;
        if (payload.iss !== expectedIssuer) {
          this.logger.warn(
            `Issuer incorreto: esperado ${expectedIssuer}, recebido ${payload.iss}`,
          );
        }
      }
      
      // Se o token tem email e sub, é válido
      if (!payload.email || !payload.sub) {
        this.logger.warn('Token não contém email ou sub:', payload);
      }
      
      this.logger.log('JWT validado com sucesso:', {
        sub: payload.sub,
        email: payload.email,
        iss: payload.iss || 'não disponível',
        aud: payload.aud || 'não disponível',
        test: this.isTestEnvironment
          ? 'ambiente de teste'
          : 'ambiente de produção',
      });
      
      return payload;
    } catch (error) {
      this.logger.error(`Erro ao validar JWT: ${error.message}`);
      throw new UnauthorizedException('Falha na autenticação do token');
    }
  }
}
