import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

// Mock do process.env para testes
const originalEnv = process.env;

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    // Configurando env mocks para testes
    process.env = {
      ...originalEnv,
      AUTH0_DOMAIN: 'test-domain.auth0.com',
      AUTH0_AUDIENCE: 'test-audience',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    process.env = originalEnv; // Restaurar env original após os testes
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate a valid payload', () => {
      const mockPayload = {
        sub: 'auth0|123456789',
        email: 'test@example.com',
        iss: 'https://test-domain.auth0.com/',
        aud: 'test-audience',
      };

      const result = jwtStrategy.validate(mockPayload);
      expect(result).toEqual(mockPayload);
    });

    it('should throw UnauthorizedException for null payload', () => {
      expect(() => {
        jwtStrategy.validate(null);
      }).toThrow(UnauthorizedException);
    });

    it('should accept payload with warning for incorrect audience', () => {
      const mockPayload = {
        sub: 'auth0|123456789',
        email: 'test@example.com',
        iss: 'https://test-domain.auth0.com/',
        aud: 'wrong-audience',
      };

      // Deve aceitar, mas gerar aviso no log
      const result = jwtStrategy.validate(mockPayload);
      expect(result).toEqual(mockPayload);
    });

    it('should accept payload with warning for incorrect issuer', () => {
      const mockPayload = {
        sub: 'auth0|123456789',
        email: 'test@example.com',
        iss: 'https://wrong-domain.auth0.com/',
        aud: 'test-audience',
      };

      // Deve aceitar, mas gerar aviso no log
      const result = jwtStrategy.validate(mockPayload);
      expect(result).toEqual(mockPayload);
    });
  });
});
