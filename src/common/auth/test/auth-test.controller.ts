import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/auth/guard/auth.guard';

/**
 * Controlador para testes de autenticação
 * Use este controlador para verificar se a autenticação JWT está funcionando corretamente
 */
@Controller('auth-test')
export class AuthTestController {
  /**
   * Rota pública que não requer autenticação
   * Útil para verificar se o serviço está online
   */
  @Get('public')
  public getPublic() {
    return {
      message: 'Este é um endpoint público, acessível sem autenticação',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Rota protegida que requer autenticação JWT
   * Se você conseguir acessar esta rota, significa que seu token JWT é válido
   */
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  public getProtected(@Request() req) {
    return {
      message: 'Você está autenticado!',
      token: {
        sub: req.user.sub,
        email: req.user.email,
      },
      timestamp: new Date().toISOString(),
    };
  }
  
  /**
   * Rota que retorna detalhes do usuário autenticado
   * Útil para debugar o conteúdo do token JWT
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  public getProfile(@Request() req) {
    return {
      user: req.user,
      timestamp: new Date().toISOString(),
    };
  }
}
