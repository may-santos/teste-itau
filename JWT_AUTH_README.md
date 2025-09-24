## Testando a Autenticação JWT com Auth0

Este projeto inclui um script utilitário para testar tokens JWT do Auth0, ajudando a diagnosticar problemas de autenticação.

### Como usar o script de teste JWT

1. Obtenha um token JWT do Auth0 (via sua aplicação frontend ou usando cURL para a API Auth0)
2. Execute o script fornecendo o token:

```bash
node scripts/test-jwt-auth.js YOUR_AUTH0_JWT_TOKEN
```

O script irá:
- Decodificar o token e exibir suas informações principais
- Verificar se o audience e issuer do token correspondem às configurações no `.env`
- Tentar chamar endpoints protegidos da API para verificar se o token é aceito
- Fornecer dicas de solução de problemas caso a autenticação falhe

### Solução de problemas comuns com Auth0

1. **Token sendo rejeitado (401 Unauthorized)**:
   - Verifique se o `AUTH0_AUDIENCE` no `.env` corresponde ao configurado no Auth0
   - Confirme que o `AUTH0_DOMAIN` está correto
   - Certifique-se de que o token não está expirado

2. **Problemas com audience**:
   - No Auth0 Dashboard, verifique a configuração da sua API
   - O identifier da API deve corresponder exatamente ao `AUTH0_AUDIENCE` no `.env`

3. **Problemas com CORS**:
   - Se estiver testando com uma aplicação frontend, certifique-se de que as origens permitidas estão configuradas no Auth0

4. **Logs de depuração**:
   - A JwtStrategy agora inclui logs detalhados que podem ajudar a identificar problemas
   - Verifique os logs do servidor para mensagens como "Audience incorreto" ou "Issuer incorreto"

### Ambiente de teste vs. produção

Para facilitar o desenvolvimento e testes automatizados, a JwtStrategy foi modificada para detectar automaticamente o ambiente:

- Em ambiente de produção: usa a configuração completa do Auth0 com JWKS
- Em ambiente de teste: usa uma chave simples para permitir tokens de teste

Para forçar o modo de teste, você pode definir a variável de ambiente:
```bash
NODE_ENV=test npm run start:dev
```
