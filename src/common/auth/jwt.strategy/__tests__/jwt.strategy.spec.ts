process.env.AUTH0_DOMAIN = 'test-secret';
process.env.AUTH0_AUDIENCE = 'test-issuer';

import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from '../jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();
    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should validate and return user payload', async () => {
      const payload = { sub: 'user123', email: 'user@example.com' };
      const result = await strategy.validate(payload);

      expect(result).toEqual({ sub: 'user123', email: 'user@example.com' });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException if payload is invalid', async () => {
      const invalidPayload = { userId: 'user@example.com' };
      await expect(strategy.validate(invalidPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
