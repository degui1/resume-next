# Plano de Implementação - Simplificação de Testes

## Fase 1: Limpeza (3 dias)

- [x] 1. Remover testes desnecessários
  - Remover `__tests__/properties/home-components.properties.test.tsx`
  - Remover `__tests__/properties/links-components.properties.test.tsx`
  - Remover `__tests__/properties/reusable-components.properties.test.tsx`
  - Remover `__tests__/properties/github-api.properties.test.ts`
  - Remover `__tests__/properties/github-service.properties.test.ts`
  - Remover `__tests__/properties/github-error-handling.properties.test.ts`
  - Manter apenas testes unitários simples em `__tests__/unit/`
  - Executar suite de testes para validar
  - _Requirements: 1.1.1, 1.1.2, 1.1.3, 2.1.1, 2.1.3_

- [x] 2. Corrigir bug de classificação de erro 403
  - Implementar função `extractErrorMessage` em `lib/api/errors.ts`
  - Modificar `classifyErrorByStatus` para analisar mensagem de erro
  - Adicionar lógica para detectar "rate limit" na mensagem
  - Retornar RateLimitError quando mensagem contém "rate limit"
  - Retornar AuthenticationError caso contrário
  - Criar `__tests__/unit/errors.test.ts` com testes para ambos os casos
  - Validar que bug foi corrigido
  - _Requirements: 1.3.1, 2.4.1_

- [x] 3. Limpar código
  - Identificar todos os `eslint-disable` em código
  - Corrigir código para não precisar de eslint-disable
  - Remover diretivas eslint-disable
  - Padronizar `lib/github/config.ts` para retornar `undefined` ao invés de empty string
  - Atualizar interface GitHubConfig para usar `string | undefined`
  - Executar linter e validar
  - _Requirements: 1.3.2, 1.3.3, 2.4.2, 2.4.3_

- [x] 4. Validação Fase 1
  - Executar suite completa de testes
  - Validar que site funciona exatamente como antes
  - Validar que bug de 403 foi corrigido
  - Medir tempo de execução de testes (deve ser mais rápido)

## Fase 2: Testes Unitários Essenciais (2 dias)

- [x] 5. Adicionar testes para GetInTouch
  - Criar `__tests__/unit/GetInTouch.test.tsx`
  - Testar validação de email format
  - Testar validação de campos obrigatórios (name, email, message)
  - Testar submissão de formulário com dados válidos
  - Testar loading state durante submissão
  - Testar error handling
  - Usar dados mockados simples
  - _Requirements: 1.4.1, 2.2.1_

- [x] 6. Adicionar testes para TestimonialsCarousel
  - Criar `__tests__/unit/TestimonialsCarousel.test.tsx`
  - Testar navegação para próximo testimonial (next button)
  - Testar navegação para testimonial anterior (previous button)
  - Testar loop circular (após último volta para primeiro)
  - Testar indicadores de posição
  - Usar dados mockados simples (array de 2-3 testimonials)
  - _Requirements: 1.4.2, 2.2.2_

- [x] 7. Validação Fase 2
  - Executar testes unitários
  - Validar que componentes funcionam corretamente
  - Validar que testes são simples e fáceis de entender

## Fase 3: Testes E2E (3 dias)

- [ ] 8. Configurar Playwright
  - Instalar `@playwright/test` como devDependency
  - Executar `npm install`
  - Executar `npx playwright install` para instalar browsers
  - Criar `playwright.config.ts` na raiz do projeto
  - Configurar testDir como `./__tests__/e2e`
  - Configurar projeto chromium
  - Configurar webServer para iniciar dev server automaticamente
  - Adicionar scripts `test:e2e` e `test:e2e:ui` ao package.json
  - _Requirements: 1.2.1, 2.3.1_

- [ ] 9. Criar testes E2E para fluxos principais
  - Criar `__tests__/e2e/portfolio.spec.ts`
  - Testar exibição da home page (h1 visível)
  - Testar navegação para about page (clicar link, validar URL)
  - Testar navegação para links page (clicar link, validar URL)
  - Testar carregamento de projetos do GitHub (aguardar cards, validar que existem)
  - Testar validação de formulário de contato (submeter vazio, validar erros)
  - Testar responsividade mobile (viewport 375x667, validar menu mobile)
  - _Requirements: 1.2.1, 1.2.2, 1.2.3, 2.3.1, 2.3.2, 2.3.3_

- [ ] 10. Validação Fase 3
  - Executar testes E2E localmente
  - Validar que todos os fluxos principais funcionam
  - Validar que integração com GitHub API funciona
  - Validar que testes são estáveis (não flaky)

## Checkpoint Final

- [ ] 11. Validação completa do projeto
  - Executar todos os testes (unit + E2E)
  - Validar que site funciona perfeitamente
  - Validar métricas de sucesso:
    - Tempo de execução <10s
    - ~20 testes totais
    - Testes simples e fáceis de entender
  - Validar que bug de 403 foi corrigido
  - Validar que não há eslint-disable desnecessários
  - Documentar mudanças realizadas

## Resumo

**Total:** 11 tarefas em 3 fases (8 dias / 1.5 semanas)

**Fase 1 (3 dias):** Remover complexidade, corrigir bugs, limpar código
**Fase 2 (2 dias):** Testes unitários para GetInTouch e TestimonialsCarousel
**Fase 3 (3 dias):** Configurar Playwright e criar testes E2E

**Resultado:** Codebase mais simples, testes mais rápidos, mesma confiança.
