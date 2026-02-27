# Simplificação de Testes - Design Técnico

## Overview

Este design técnico detalha uma estratégia pragmática e simplificada para melhorar a qualidade de testes de um site de portfólio pessoal. O foco é em:

1. **Remover Complexidade** - Eliminar testes desnecessários e property-based tests excessivos
2. **Testes Unitários Essenciais** - Testar apenas componentes com lógica usando dados mockados
3. **Testes E2E** - Validar fluxos reais e integração com APIs
4. **Correções de Bugs** - Corrigir classificação de erro 403 e limpar código

A abordagem é incremental e pragmática, priorizando simplicidade sobre cobertura excessiva.

## Glossary

- **Bug_Condition (C)**: Complexidade excessiva de testes para um site de portfólio
- **Property (P)**: Estratégia simplificada focada no essencial
- **Preservation**: Funcionalidade existente que deve continuar funcionando
- **E2E (End-to-End)**: Testes que validam fluxos completos em browser real
- **Playwright**: Ferramenta para testes E2E
- **Mocked Data**: Dados simples para testes unitários de componentes

## Bug Details

### Fault Condition

O problema principal é complexidade excessiva de testes para um site de portfólio pessoal simples.

**Formal Specification:**
```
FUNCTION isBugCondition(testStrategy)
  INPUT: testStrategy of type TestingApproach
  OUTPUT: boolean
  
  RETURN (
    // Complexidade Excessiva
    (testStrategy.hasPropertyBasedTests AND
     testStrategy.projectType == "portfolio-website") OR
    
    // Falta de E2E
    (testStrategy.e2eTests == 0 AND
     testStrategy.hasPages) OR
    
    // Componentes com Lógica Sem Testes
    (testStrategy.componentsWithLogic > 0 AND
     testStrategy.unitTestsForLogic == 0) OR
    
    // Bugs Reais
    (testStrategy.has403ClassificationBug OR
     testStrategy.hasEslintDisable OR
     testStrategy.hasInconsistentConfig)
  )
END FUNCTION
```

### Examples

**Complexidade Excessiva:**
```typescript
// Atual (Problemático):
it('should render icon and text for any highlight', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...highlights),
      (highlight) => {
        render(<HighlightItem highlight={highlight} />);
        expect(screen.getByText(highlight.text)).toBeInTheDocument();
      }
    ),
    { numRuns: 100 }  // 100 runs para teste simples!
  );
});

// Esperado (Simplificado):
it('should render highlight with icon and text', () => {
  const highlight = { icon: 'star', text: 'Featured' };
  render(<HighlightItem highlight={highlight} />);
  expect(screen.getByText('Featured')).toBeInTheDocument();
});
```

**Falta de E2E:**
```typescript
// Atual: Nenhum teste E2E
// Esperado: Testes E2E com Playwright

test('user can navigate through portfolio', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toBeVisible();
  
  await page.click('a[href="/en/about"]');
  await expect(page).toHaveURL('/en/about');
});
```

**Bug de Classificação 403:**
```typescript
// Atual (Problemático):
if (statusCode === 403) {
  return new AuthenticationError(messages.AUTHENTICATION, statusCode, metadata);
}

// Esperado (Corrigido):
if (statusCode === 403) {
  const errorMessage = extractErrorMessage(error);
  if (errorMessage && /rate limit/i.test(errorMessage)) {
    return new RateLimitError<T>(messages.RATE_LIMIT, statusCode, metadata);
  }
  return new AuthenticationError(messages.AUTHENTICATION, statusCode, metadata);
}
```

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Todas as funcionalidades para usuários finais devem permanecer idênticas
- Site deve continuar funcionando exatamente como antes
- Integração com GitHub API deve continuar funcionando

**Scope:**
Todas as mudanças são em testes e limpeza de código - nenhuma funcionalidade visível muda.

## Hypothesized Root Cause

**Causa:** Specs anteriores geraram testes excessivamente complexos sem considerar o contexto (site de portfólio pessoal simples).

**Evidência:**
- Property-based tests com 100 runs para validações simples
- Múltiplos testes redundantes
- Falta de testes E2E para validar fluxos reais
- Foco em cobertura de linhas ao invés de comportamento útil

## Correctness Properties

Property 1: Estratégia Simplificada

_For any_ teste no projeto, o sistema simplificado SHALL ter apenas testes unitários para componentes com lógica e testes E2E para fluxos, sem property-based tests desnecessários.

**Validates: Requirements 2.1.1, 2.1.2, 2.1.3**

Property 2: Componentes Essenciais Testados

_For any_ componente com lógica de negócio (GetInTouch, TestimonialsCarousel), o sistema SHALL ter testes unitários simples com dados mockados validando comportamento.

**Validates: Requirements 2.2.1, 2.2.2**

Property 3: Testes E2E para Fluxos

_For any_ página ou fluxo de usuário, o sistema SHALL ter testes E2E com Playwright validando comportamento real.

**Validates: Requirements 2.3.1, 2.3.2, 2.3.3**

Property 4: Código Limpo

_For any_ erro 403, o sistema SHALL classificar corretamente baseado na mensagem, e não SHALL ter eslint-disable desnecessários.

**Validates: Requirements 2.4.1, 2.4.2, 2.4.3**

Property 5: Preservation

_For any_ funcionalidade existente, o sistema SHALL manter comportamento idêntico após simplificação.

**Validates: Requirements 3.1.1, 3.1.2, 3.1.3**

## Fix Implementation

### Changes Required

A implementação segue 3 fases simples:

### Fase 1: Limpeza (3 dias)

#### 1.1 Remover Testes Desnecessários

**Arquivos a Remover:**
- `__tests__/properties/home-components.properties.test.tsx`
- `__tests__/properties/links-components.properties.test.tsx`
- `__tests__/properties/reusable-components.properties.test.tsx`
- `__tests__/properties/github-api.properties.test.ts` (manter apenas testes unitários simples)
- `__tests__/properties/github-service.properties.test.ts` (manter apenas testes unitários simples)

**Justificativa:** Property-based testing é desnecessário para um site de portfólio. Testes unitários simples são suficientes.

#### 1.2 Corrigir Bug de Classificação 403

**Arquivo:** `lib/api/errors.ts`

**Mudanças:**
```typescript
// Adicionar função helper
function extractErrorMessage(error: unknown): string | null {
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    if ('body' in error && typeof error.body === 'object' && error.body) {
      const body = error.body as Record<string, unknown>;
      if ('message' in body && typeof body.message === 'string') {
        return body.message;
      }
    }
  }
  return null;
}

// Modificar classifyErrorByStatus
if (statusCode === 403) {
  const errorMessage = extractErrorMessage(error);
  
  if (errorMessage && /rate limit/i.test(errorMessage)) {
    return new RateLimitError<T>(messages.RATE_LIMIT, statusCode, metadata);
  }
  
  return new AuthenticationError(messages.AUTHENTICATION, statusCode, metadata) as ApiError<T>;
}
```

**Teste:**
```typescript
describe('classifyErrorByStatus - 403 handling', () => {
  it('should classify 403 with rate limit as RateLimitError', () => {
    const error = { status: 403, message: 'API rate limit exceeded' };
    const result = classifyErrorByStatus(error);
    expect(result).toBeInstanceOf(RateLimitError);
  });

  it('should classify 403 without rate limit as AuthenticationError', () => {
    const error = { status: 403, message: 'Bad credentials' };
    const result = classifyErrorByStatus(error);
    expect(result).toBeInstanceOf(AuthenticationError);
  });
});
```

#### 1.3 Limpar Código

**Remover eslint-disable:**
- Identificar e corrigir código que precisa de eslint-disable
- Remover diretivas após correção

**Padronizar configuração:**
```typescript
// lib/github/config.ts
export interface GitHubConfig {
  username: string | undefined;
  token: string | undefined;
  revalidate: number;
  fallbackToMock: boolean;
}

export function getGitHubConfig(): GitHubConfig {
  return {
    username: process.env.GITHUB_USERNAME || undefined,
    token: process.env.GITHUB_TOKEN || undefined,
    revalidate: Number(process.env.GITHUB_REVALIDATE) || 3600,
    fallbackToMock: process.env.GITHUB_FALLBACK_TO_MOCK === 'true'
  };
}
```

### Fase 2: Testes Unitários Essenciais (2 dias)

#### 2.1 GetInTouch (Formulário)

**Arquivo:** `__tests__/unit/GetInTouch.test.tsx` (novo)

**Estrutura:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import GetInTouch from '@/components/home/GetInTouch';

describe('GetInTouch', () => {
  it('should validate email format', () => {
    render(<GetInTouch />);
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('should validate required fields', () => {
    render(<GetInTouch />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    render(<GetInTouch />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello' } });
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Validar comportamento de submissão
  });
});
```

#### 2.2 TestimonialsCarousel

**Arquivo:** `__tests__/unit/TestimonialsCarousel.test.tsx` (novo)

**Estrutura:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';

const mockTestimonials = [
  { id: 1, text: 'Great work!', author: 'John' },
  { id: 2, text: 'Excellent!', author: 'Jane' },
];

describe('TestimonialsCarousel', () => {
  it('should navigate to next testimonial', () => {
    render(<TestimonialsCarousel testimonials={mockTestimonials} />);
    
    expect(screen.getByText('Great work!')).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    expect(screen.getByText('Excellent!')).toBeInTheDocument();
  });

  it('should navigate to previous testimonial', () => {
    render(<TestimonialsCarousel testimonials={mockTestimonials} />);
    
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /previous/i }));
    
    expect(screen.getByText('Great work!')).toBeInTheDocument();
  });

  it('should loop back to first after last', () => {
    render(<TestimonialsCarousel testimonials={mockTestimonials} />);
    
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    expect(screen.getByText('Great work!')).toBeInTheDocument();
  });
});
```

### Fase 3: Testes E2E (3 dias)

#### 3.1 Configurar Playwright

**Arquivo:** `playwright.config.ts` (novo)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Package.json:**
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

#### 3.2 Testes E2E Essenciais

**Arquivo:** `__tests__/e2e/portfolio.spec.ts` (novo)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Portfolio Website', () => {
  test('should display home page', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/en');
    await page.click('a[href="/en/about"]');
    await expect(page).toHaveURL('/en/about');
    await expect(page.locator('h1')).toContainText('About');
  });

  test('should navigate to links page', async ({ page }) => {
    await page.goto('/en');
    await page.click('a[href="/en/links"]');
    await expect(page).toHaveURL('/en/links');
  });

  test('should display GitHub projects', async ({ page }) => {
    await page.goto('/en');
    
    // Aguardar carregamento de projetos
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 });
    
    const projects = page.locator('[data-testid="project-card"]');
    await expect(projects).toHaveCount.greaterThan(0);
  });

  test('should validate contact form', async ({ page }) => {
    await page.goto('/en');
    
    const form = page.locator('[data-testid="contact-form"]');
    await form.locator('button[type="submit"]').click();
    
    // Validar mensagens de erro
    await expect(page.locator('[data-testid="error-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-email"]')).toBeVisible();
  });

  test('should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/en');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
  });
});
```

## Testing Strategy

### Validation Approach

**Fase 1 - Limpeza:**
- Remover testes desnecessários
- Corrigir bug de 403
- Limpar código
- Validar que site funciona igual

**Fase 2 - Testes Unitários:**
- Adicionar testes para GetInTouch
- Adicionar testes para TestimonialsCarousel
- Validar que componentes funcionam

**Fase 3 - Testes E2E:**
- Configurar Playwright
- Adicionar testes para fluxos principais
- Validar integração com GitHub API

### Unit Tests

**GetInTouch:**
- Validação de email
- Campos obrigatórios
- Submissão de formulário

**TestimonialsCarousel:**
- Navegação next/previous
- Loop circular
- Indicadores

### E2E Tests

**Fluxos Principais:**
- Navegação entre páginas
- Carregamento de projetos do GitHub
- Validação de formulário
- Responsividade mobile

## Implementation Timeline

**Total:** 8 dias (1.5 semanas)

**Fase 1: Limpeza (3 dias)**
- Dia 1: Remover testes desnecessários
- Dia 2: Corrigir bug 403 e limpar código
- Dia 3: Validação

**Fase 2: Testes Unitários (2 dias)**
- Dia 4: GetInTouch
- Dia 5: TestimonialsCarousel

**Fase 3: Testes E2E (3 dias)**
- Dia 6: Configurar Playwright
- Dia 7: Criar testes E2E
- Dia 8: Validação final

## Success Metrics

### Quantitative Metrics

- **Tempo de Execução:** <10s (redução de ~70%)
- **Número de Testes:** ~20 testes (redução de ~85%)
- **Manutenibilidade:** Testes simples e fáceis de entender

### Qualitative Metrics

- **Clareza:** Fácil entender o que cada teste valida
- **Pragmatismo:** Testes focados no essencial
- **Confiança:** Testes validam comportamento real

## Risk Analysis and Mitigation

### Risks

1. **Remover testes pode causar regressões**
   - Mitigação: Testes E2E cobrem fluxos principais
   - Validação manual após mudanças

2. **Testes E2E podem ser flaky**
   - Mitigação: Usar waitFor e seletores estáveis
   - Configurar retries em CI

### Rollback Plan

- Fase 1: Reverter commits (baixo risco)
- Fase 2: Remover novos testes (muito baixo risco)
- Fase 3: Remover Playwright (muito baixo risco)

## Conclusion

Este design simplificado foca em pragmatismo e simplicidade para um site de portfólio pessoal. A estratégia é:

1. Remover complexidade desnecessária
2. Testar apenas componentes com lógica
3. Validar fluxos reais com E2E
4. Corrigir bugs conhecidos

**Resultado:** Codebase mais simples, testes mais rápidos, mesma confiança.
