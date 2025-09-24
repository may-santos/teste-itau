import { JwtService } from '@nestjs/jwt';

/**
 * Helper para criar tokens JWT de teste
 * Esta classe é útil para gerar tokens para testes de integração
 */
export class AuthTestHelper {
  private readonly jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService({
      secret: 'test-secret-key-for-testing-only',
    });
  }

  /**
   * Cria um token JWT mock para testes
   * @param email O email do usuário (usado como sub)
   * @param audience O audience do token
   * @returns Um token JWT válido para testes
   */
  createTestToken(email: string, audience = 'api://default'): string {
    const payload = {
      sub: `auth0|${Buffer.from(email).toString('hex')}`,
      email: email,
      iss: `https://${process.env.AUTH0_DOMAIN || 'dev-55j4r7qjkq8wq4qs.us.auth0.com'}/`,
      aud: audience,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
      iat: Math.floor(Date.now() / 1000),
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Decodifica um token JWT para verificar seu conteúdo
   * @param token O token JWT a ser decodificado
   * @returns O payload do token decodificado
   */
  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
