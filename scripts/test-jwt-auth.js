#!/usr/bin/env node

/**
 * Script para testar a autenticação JWT com Auth0
 * 
 * Este script permite verificar se o JWT obtido do Auth0 é válido para 
 * o backend, ajudando a diagnosticar problemas de autenticação.
 * 
 * Como usar:
 * 1. Obtenha um token JWT do Auth0 (da sua aplicação frontend ou usando
 *    curl para a API Auth0)
 * 2. Execute: node test-jwt-auth.js YOUR_TOKEN
 */

const axios = require('axios');
const dotenv = require('dotenv');
const jwtDecode = require('jwt-decode');

dotenv.config();

const token = process.argv[2];

if (!token) {
  console.error('Token JWT não fornecido!');
  console.log('');
  console.log('Uso: node test-jwt-auth.js YOUR_AUTH0_JWT_TOKEN');
  console.log('');
  process.exit(1);
}

const API_URL = 'http://localhost:3000';

// Decodifica o token sem validação para exibir informações
try {
  const decoded = jwtDecode(token);
  console.log('📄 Informações do token:');
  console.log('------------------------');
  console.log('Subject (sub):', decoded.sub);
  console.log('Email:', decoded.email);
  console.log('Emissor (iss):', decoded.iss);
  console.log('Audience (aud):', decoded.aud);
  console.log('Expira em:', new Date(decoded.exp * 1000).toLocaleString());
  console.log('------------------------');
  
  console.log('\n⚠️  Verificando configurações:');
  console.log('------------------------');
  if (decoded.aud !== process.env.AUTH0_AUDIENCE) {
    console.log('❌ ERRO: Audience do token não corresponde ao AUTH0_AUDIENCE no .env');
    console.log(`   Token: ${decoded.aud}`);
    console.log(`   .env: ${process.env.AUTH0_AUDIENCE}`);
  } else {
    console.log('✅ Audience do token corresponde ao AUTH0_AUDIENCE no .env');
  }

  const expectedIssuer = `https://${process.env.AUTH0_DOMAIN}/`;
  if (decoded.iss !== expectedIssuer) {
    console.log('❌ ERRO: Issuer do token não corresponde ao AUTH0_DOMAIN no .env');
    console.log(`   Token: ${decoded.iss}`);
    console.log(`   Esperado: ${expectedIssuer}`);
  } else {
    console.log('✅ Issuer do token corresponde ao AUTH0_DOMAIN no .env');
  }
  console.log('------------------------');
} catch (error) {
  console.error('❌ Erro ao decodificar token:', error.message);
  process.exit(1);
}

// Tenta fazer uma chamada autenticada à API
console.log('\n🔒 Testando autenticação na API:');
console.log('------------------------');

async function testEndpoint(endpoint) {
  // Verifica se é um endpoint público
  const isPublicEndpoint = endpoint === 'auth-test/public';
  
  try {
    const headers = isPublicEndpoint 
      ? {} 
      : { Authorization: `Bearer ${token}` };
    
    const response = await axios.get(`${API_URL}/${endpoint}`, { headers });
    
    if (isPublicEndpoint) {
      console.log(`✅ ${endpoint}: Acesso público funcionando (${response.status})`);
    } else {
      console.log(`✅ ${endpoint}: Autenticado com sucesso (${response.status})`);
    }
    return true;
  } catch (error) {
    if (error.response) {
      console.log(
        `❌ ${endpoint}: Falha ${isPublicEndpoint ? 'no acesso' : 'na autenticação'} (${error.response.status})`,
      );
      if (error.response.data) {
        console.log(
          '   Mensagem:',
          error.response.data.message || JSON.stringify(error.response.data),
        );
      }
    } else {
      console.log(`❌ ${endpoint}: Erro na requisição: ${error.message}`);
    }
    return false;
  }
}

async function runTests() {
  console.log('🔍 Verificando se a API está em execução...');
  try {
    await axios.get(`${API_URL}`);
  } catch (error) {
    if (!error.response) {
      console.error('❌ API não está respondendo. Certifique-se de que o servidor está em execução (npm run start:dev)');
      process.exit(1);
    }
  }

  const endpoints = [
    'auth-test/public', // Deve funcionar sempre (endpoint público)
    'auth-test/protected', // Testa autenticação em um endpoint simples
    'auth-test/me', // Retorna detalhes do token/usuário
    'transactions/balance',
    'transactions',
    'transactions/my-transactions',
  ];

  let successCount = 0;
  let totalProtectedEndpoints = 0;
  
  for (const endpoint of endpoints) {
    const isPublic = endpoint === 'auth-test/public';
    if (!isPublic) totalProtectedEndpoints++;
    
    const success = await testEndpoint(endpoint);
    if (success && !isPublic) successCount++;
  }

  console.log('------------------------');
  console.log(
    `Resultado: ${successCount} de ${totalProtectedEndpoints} endpoints protegidos autenticados com sucesso`,
  );

  if (successCount === 0) {
    console.log('\n🔍 Dicas para solucionar problemas:');
    console.log(
      '1. Verifique se o AUTH0_AUDIENCE no .env corresponde ao configurado no Auth0',
    );
    console.log('2. Verifique se o AUTH0_DOMAIN no .env está correto');
    console.log('3. Certifique-se de que o token não está expirado');
    console.log(
      '4. Verifique se o servidor está usando as variáveis de ambiente corretas (restart pode ser necessário)',
    );
  }
}

runTests();
