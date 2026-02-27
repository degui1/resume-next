# Simplificação de Testes - Documento de Requisitos

## Introdução

Este documento identifica a complexidade excessiva na estratégia de testes atual para um site de portfólio pessoal. O projeto possui:

- Testes de propriedades desnecessários para casos simples
- Mocks complexos onde dados simples seriam suficientes
- Cobertura excessiva que não adiciona valor para um site de portfólio
- Falta de testes E2E para validar fluxos reais

O objetivo é simplificar drasticamente a estratégia de testes, mantendo apenas o essencial:
- Testes unitários para componentes com lógica (formulário, carousel)
- Testes E2E para validar páginas e integração com APIs
- Remover testes redundantes e desnecessários

## Análise de Problemas

### 1. Problemas Atuais (Defects)

#### 1.1 Complexidade Excessiva de Testes

**1.1.1** QUANDO testes de propriedades são executados ENTÃO o sistema usa property-based testing para casos simples que não precisam de geração automática de dados

**1.1.2** QUANDO testes de componentes são executados ENTÃO o sistema testa renderização básica com 100 runs do fast-check ao invés de um teste unitário simples

**1.1.3** QUANDO testes de API são executados ENTÃO o sistema possui múltiplos testes redundantes que validam o mesmo comportamento

#### 1.2 Falta de Testes E2E

**1.2.1** QUANDO páginas são testadas ENTÃO o sistema não possui testes E2E para validar fluxos completos do usuário

**1.2.2** QUANDO integração com GitHub API é testada ENTÃO o sistema usa apenas mocks ao invés de validar comportamento real

**1.2.3** QUANDO navegação é testada ENTÃO o sistema não valida fluxos reais entre páginas

#### 1.3 Bugs Reais no Código

**1.3.1** QUANDO o error handler processa erros 403 ENTÃO o sistema não distingue corretamente entre rate limit e autenticação

**1.3.2** QUANDO componentes renderizam imagens ENTÃO o sistema usa `eslint-disable` para contornar regras de acessibilidade

**1.3.3** QUANDO a configuração é lida ENTÃO o sistema retorna valores inconsistentes (empty string vs undefined)

#### 1.4 Componentes Sem Testes

**1.4.1** QUANDO componentes com lógica são analisados ENTÃO GetInTouch (formulário) não possui testes de validação

**1.4.2** QUANDO componentes com lógica são analisados ENTÃO TestimonialsCarousel não possui testes de navegação

### 2. Comportamento Esperado (Correct)

#### 2.1 Estratégia de Testes Simplificada

**2.1.1** QUANDO testes unitários são executados ENTÃO o sistema DEVE testar apenas componentes com lógica de negócio usando dados mockados simples

**2.1.2** QUANDO testes E2E são executados ENTÃO o sistema DEVE validar fluxos completos e integração com APIs reais

**2.1.3** QUANDO testes são organizados ENTÃO o sistema DEVE ter apenas testes unitários e E2E, sem property-based tests desnecessários

#### 2.2 Componentes Essenciais Testados

**2.2.1** QUANDO GetInTouch é testado ENTÃO o sistema DEVE validar lógica de validação de formulário com dados mockados

**2.2.2** QUANDO TestimonialsCarousel é testado ENTÃO o sistema DEVE validar lógica de navegação com dados mockados

**2.2.3** QUANDO outros componentes são testados ENTÃO o sistema DEVE focar apenas em componentes com lógica, não componentes de apresentação simples

#### 2.3 Testes E2E para Fluxos Reais

**2.3.1** QUANDO páginas são testadas ENTÃO o sistema DEVE usar Playwright para validar renderização e navegação

**2.3.2** QUANDO integração com GitHub é testada ENTÃO o sistema DEVE validar que dados reais são carregados corretamente

**2.3.3** QUANDO formulário é testado ENTÃO o sistema DEVE validar submissão end-to-end

#### 2.4 Código Limpo

**2.4.1** QUANDO o error handler processa erros 403 ENTÃO o sistema DEVE analisar a mensagem de erro para distinguir entre rate limit e autenticação

**2.4.2** QUANDO componentes renderizam imagens ENTÃO o sistema DEVE usar componentes apropriados sem eslint-disable

**2.4.3** QUANDO a configuração é lida ENTÃO o sistema DEVE retornar valores consistentes

### 3. Comportamento Preservado (Regression Prevention)

#### 3.1 Funcionalidade Existente

**3.1.1** QUANDO melhorias são implementadas ENTÃO o sistema DEVE CONTINUAR A funcionar exatamente como antes para usuários finais

**3.1.2** QUANDO testes são simplificados ENTÃO o sistema DEVE CONTINUAR A detectar bugs reais

**3.1.3** QUANDO código é refatorado ENTÃO o sistema DEVE CONTINUAR A fornecer as mesmas funcionalidades

## Problemas Identificados por Categoria

### Categoria A: Complexidade Excessiva

**Arquivos Afetados:**
- `__tests__/properties/` - Múltiplos testes de propriedades desnecessários para um site de portfólio
- Testes com 100 runs para validações simples
- Property-based testing onde testes unitários simples seriam suficientes

**Impacto:**
- Tempo de execução longo
- Manutenção complexa
- Falsa sensação de segurança

### Categoria B: Falta de Testes E2E

**Arquivos Afetados:**
- Nenhum teste E2E configurado
- Páginas não são testadas em fluxos reais
- Integração com GitHub API não é validada

**Impacto:**
- Bugs podem passar despercebidos em fluxos reais
- Sem validação de integração real com APIs
- Sem validação de navegação entre páginas

### Categoria C: Bugs Reais

**Arquivos Afetados:**
- `lib/api/errors.ts` - Classificação incorreta de erro 403
- Componentes com `eslint-disable`
- `lib/github/config.ts` - Retorno inconsistente

**Impacto:**
- Bugs em produção
- Código difícil de manter
- Violações de boas práticas

### Categoria D: Componentes Sem Testes

**Arquivos Afetados:**
- `components/home/GetInTouch.tsx` - Formulário sem testes de validação
- `components/home/TestimonialsCarousel.tsx` - Carousel sem testes de navegação

**Impacto:**
- Componentes com lógica não validados
- Risco de regressões em funcionalidades importantes

## Próximos Passos (Planejamento)

Este documento serve como base para simplificar a estratégia de testes:

1. **Remover Complexidade** - Eliminar testes desnecessários e property-based tests excessivos
2. **Adicionar Testes E2E** - Implementar Playwright para validar fluxos reais
3. **Testar Componentes Essenciais** - Focar apenas em componentes com lógica
4. **Corrigir Bugs** - Corrigir classificação de erro 403 e limpar código

**IMPORTANTE:** Foco em simplicidade e pragmatismo para um site de portfólio pessoal.
