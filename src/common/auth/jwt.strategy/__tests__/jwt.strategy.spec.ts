import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'AUTH0_DOMAIN') return 'dev-domain.auth0.com';
              if (key === 'AUTH0_AUDIENCE') return 'https://api-audience/';
              return null;
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return the payload', async () => {
      // Simula um token JWT válido decodificado
      const payload = {
        sub: 'auth0|123456',
        email: 'user@example.com',
        scope: 'read:transactions write:transactions',
        iss: 'https://dev-domain.auth0.com/',
        aud: ['https://api-audience/'],
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: payload.sub,
        email: payload.email,
        scope: payload.scope,
      });
    });

    it('should throw UnauthorizedException if audience is invalid', async () => {
      // Simula um token JWT com audience inválido
      const payload = {
        sub: 'auth0|123456',
        email: 'user@example.com',
        scope: 'read:transactions write:transactions',
        iss: 'https://dev-domain.auth0.com/',
        aud: ['https://wrong-audience/'],
      };

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if issuer is invalid', async () => {
      // Simula um token JWT com issuer inválido
      const payload = {
        sub: 'auth0|123456',
        email: 'user@example.com',
        scope: 'read:transactions write:transactions',
        iss: 'https://wrong-domain.auth0.com/',
        aud: ['https://api-audience/'],
      };

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    });
  });
});
