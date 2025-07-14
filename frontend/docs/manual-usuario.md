# Manual do Usuário - Sistema de Atendimento

## Sumário
1. [Primeiro Acesso](#primeiro-acesso)
2. [Interface Principal](#interface-principal)
3. [Registrar Nova Interação](#registrar-nova-interação)
4. [Consultar Histórico](#consultar-histórico)
5. [Gerenciar Locais (Admin)](#gerenciar-locais-admin)
6. [Gerenciar Colaboradores (Admin)](#gerenciar-colaboradores-admin)
7. [Sistema de Palitagem (Admin)](#sistema-de-palitagem-admin)
8. [Relatórios (Admin)](#relatórios-admin)
9. [Configurações](#configurações)
10. [Dicas e Truques](#dicas-e-truques)

## Primeiro Acesso

### Fazendo Login
1. Abra o arquivo `index.html` no seu navegador
2. Digite seu usuário e senha
3. Clique em "Entrar"

**Credenciais Padrão:**
- **Administrador**: usuário `admin`, senha `admin123`
- **Atendente**: usuário `atendente`, senha `123456`

### Alterando Senha (Recomendado)
1. Após o primeiro login, acesse "Configurações"
2. Clique em "Alterar Senha"
3. Digite a senha atual e a nova senha
4. Confirme a alteração

## Interface Principal

### Dashboard
O dashboard mostra um resumo das informações:
- **Interações Hoje**: Número de interações registradas hoje
- **Total de Interações**: Total geral de interações
- **Locais Cadastrados**: Quantidade de locais no sistema (apenas admin)
- **Colaboradores**: Número de usuários cadastrados (apenas admin)

### Menu Lateral
- **Dashboard**: Tela inicial com resumo
- **Nova Interação**: Registrar nova interação
- **Histórico**: Consultar interações anteriores
- **Relatórios**: Relatórios completos (apenas admin)
- **Gerenciar Locais**: Cadastro de locais (apenas admin)
- **Colaboradores**: Gerenciar usuários (apenas admin)
- **Palitagem**: Configurar motivos (apenas admin)
- **Configurações**: Personalizar sistema

### Cabeçalho
- **Logo**: Logo da empresa (personalizável)
- **Nome do Sistema**: "Sistema de Atendimento"
- **Nome do Usuário**: Seu nome aparece no canto superior direito
- **Botão Sair**: Para fazer logout do sistema

## Registrar Nova Interação

### Passo 1: Buscar Local
1. Clique em "Nova Interação" no menu lateral
2. Digite o ID do local no campo correspondente
3. Clique em "Buscar" ou pressione Enter
4. As informações do local aparecerão automaticamente

### Passo 2: Preencher Dados da Interação
1. **Pessoa Contatada**: Nome da pessoa que você atendeu
2. **Descrição**: Descreva detalhadamente o atendimento realizado

### Passo 3: Classificar Dúvidas (Palitagem)
Para cada dúvida, selecione:
1. **Motivo Macro**: Categoria principal (ex: "Dúvidas Técnicas")
2. **Sub-motivo**: Subcategoria (ex: "Configuração")
3. **Motivo Micro**: Detalhamento específico (ex: "Configuração inicial")

### Passo 4: Adicionar Múltiplas Dúvidas (Opcional)
- Clique em "Adicionar Outra Dúvida" para registrar mais de uma questão
- Cada dúvida deve ter sua própria palitagem completa
- Use o "×" para remover dúvidas extras

### Passo 5: Finalizar
1. Revise todas as informações
2. Clique em "Registrar Interação"
3. Uma mensagem de sucesso confirmará o registro

## Consultar Histórico

### Visualizar Histórico
1. Clique em "Histórico" no menu lateral
2. Todas as suas interações aparecerão na tabela
3. Use "Ver Detalhes" para informações completas

### Filtrar Resultados
1. **Data Início/Fim**: Defina um período específico
2. **Local**: Digite ID ou nome do local
3. Clique em "Filtrar" para aplicar
4. Use "Limpar" para remover filtros

### Detalhes da Interação
Ao clicar em "Ver Detalhes", você verá:
- Informações gerais (data, usuário, local, pessoa contatada)
- Descrição completa do atendimento
- Todas as dúvidas com palitagem detalhada

## Gerenciar Locais (Admin)

### Cadastrar Novo Local
1. Acesse "Gerenciar Locais"
2. Clique em "Novo Local"
3. Preencha todos os campos obrigatórios:
   - **ID**: Identificador único do local
   - **Polo**: Nome do polo/unidade
   - **Gestor**: Nome do gestor responsável
   - **Endereço**: Endereço completo
4. Preencha campos opcionais conforme necessário
5. Clique em "Salvar"

### Editar Local Existente
1. Na lista de locais, clique em "Editar"
2. Modifique as informações necessárias
3. Clique em "Salvar"

### Upload em Massa (CSV)
1. Clique em "Upload CSV"
2. Selecione um arquivo CSV com os dados dos locais
3. O arquivo deve ter cabeçalhos correspondentes aos campos
4. Locais existentes serão atualizados, novos serão criados

### Formato do CSV
O arquivo deve conter as colunas:
```
id,polo,gestor,grupo,endereco,numero,complemento,bairro,precificacao,email,telefone1,telefone2,head,gerente,consultorExterno,consultorInterno
```

## Gerenciar Colaboradores (Admin)

### Cadastrar Novo Colaborador
1. Acesse "Colaboradores"
2. Clique em "Novo Colaborador"
3. Preencha:
   - **Nome Completo**: Nome do colaborador
   - **Nome de Usuário**: Login único
   - **Nível de Acesso**: Atendente ou Administrador
   - **Senha**: Senha inicial (mínimo 6 caracteres)
   - **Confirmar Senha**: Repetir a senha
4. Clique em "Salvar"

### Editar Colaborador
1. Na lista, clique em "Editar"
2. Modifique nome, nível de acesso ou status
3. Clique em "Salvar"

### Alterar Senha
1. Clique em "Alterar Senha" na linha do colaborador
2. Digite a nova senha
3. Confirme a nova senha
4. Clique em "Alterar Senha"

### Excluir Colaborador
1. Clique em "Excluir" na linha do colaborador
2. Confirme a exclusão
3. **Atenção**: Não é possível excluir seu próprio usuário

## Sistema de Palitagem (Admin)

O sistema de palitagem organiza os motivos em três níveis hierárquicos.

### Gerenciar Motivos Macro
1. Acesse "Palitagem" → aba "Motivos Macro"
2. Para adicionar: clique "Novo Motivo Macro"
3. Preencha ID único e descrição
4. Para editar: clique "Editar" na linha desejada
5. Para excluir: clique "Excluir" (remove também sub-motivos e motivos micro relacionados)

### Gerenciar Sub-motivos
1. Acesse aba "Sub-motivos"
2. Para adicionar: clique "Novo Sub-motivo"
3. Selecione o Motivo Macro pai
4. Preencha ID único e descrição
5. Edição e exclusão seguem o mesmo padrão

### Gerenciar Motivos Micro
1. Acesse aba "Motivos Micro"
2. Para adicionar: clique "Novo Motivo Micro"
3. Selecione o Sub-motivo pai
4. Preencha ID único e descrição
5. Edição e exclusão seguem o mesmo padrão

### Hierarquia da Palitagem
```
Motivo Macro (ex: "Dúvidas Técnicas")
└── Sub-motivo (ex: "Configuração")
    └── Motivo Micro (ex: "Configuração inicial")
```

## Relatórios (Admin)

### Gerar Relatório
1. Acesse "Relatórios"
2. Defina filtros opcionais:
   - **Data Início/Fim**: Período específico
   - **Colaborador**: Filtrar por usuário específico
3. Clique em "Gerar Relatório"
4. Os resultados aparecerão na tabela

### Exportar Dados
1. Após gerar o relatório, escolha o formato:
   - **CSV**: Para planilhas (Excel, Google Sheets)
   - **XML**: Para sistemas externos
2. O arquivo será baixado automaticamente

### Estatísticas do Sistema
1. Clique no botão "Estatísticas" (se disponível)
2. Visualize:
   - Estatísticas gerais do sistema
   - Top 5 motivos macro mais utilizados
   - Top 5 colaboradores mais ativos
   - Top 5 locais com mais interações

## Configurações

### Personalizar Tema
1. Acesse "Configurações"
2. Na seção "Personalização de Tema":
   - **Tema**: Escolha entre Azul, Verde, Roxo ou Cinza
   - **Cor Personalizada**: Selecione uma cor específica
3. As mudanças são aplicadas imediatamente

### Personalizar Logo (Admin)
1. Na seção "Logo da Empresa":
2. Clique em "Upload do Logo"
3. Selecione uma imagem (PNG, JPG, etc.)
4. O logo aparecerá em todas as páginas

### Mensagens de Boas-vindas (Admin)
1. Na seção correspondente:
2. **Título**: Modifique o título da mensagem
3. **Texto**: Altere o texto explicativo
4. Clique em "Salvar Configurações"

### Configurações Avançadas (Admin)
1. Clique em "Configurações Avançadas"
2. Configure:
   - **Campos Obrigatórios**: Defina quais campos são obrigatórios
   - **Funcionalidades Ativas**: Ative/desative recursos específicos
3. Clique em "Salvar"

### Backup e Restauração (Admin)
1. **Exportar**: Clique em "Exportar Configurações" para fazer backup
2. **Importar**: Use "Importar Configurações" para restaurar backup
3. **Reset**: Use "Reset Configurações" para voltar ao padrão (cuidado!)

## Dicas e Truques

### Navegação Rápida
- Use **Tab** para navegar entre campos
- **Enter** no campo ID do local executa a busca automaticamente
- **Esc** fecha modais abertos

### Eficiência no Registro
- Mantenha uma lista dos IDs de locais mais utilizados
- Configure palitagem específica para sua área de atuação
- Use descrições claras e padronizadas

### Filtros e Buscas
- Use filtros de data para relatórios periódicos
- Combine filtros para buscas mais específicas
- Exporte dados regularmente para backup

### Personalização
- Escolha cores que combinem com a identidade da empresa
- Configure mensagens que orientem novos usuários
- Mantenha o logo atualizado e em boa resolução

### Manutenção
- Faça backup das configurações regularmente
- Monitore o uso do localStorage do navegador
- Mantenha a palitagem organizada e atualizada

### Resolução de Problemas
- **Dados não aparecem**: Verifique se JavaScript está habilitado
- **Sistema lento**: Limpe o cache do navegador
- **Erro ao salvar**: Verifique se todos os campos obrigatórios estão preenchidos
- **Login não funciona**: Verifique usuário e senha, considere reset se necessário

### Boas Práticas
- **Senhas**: Use senhas seguras e altere periodicamente
- **Descrições**: Seja específico e claro nas descrições
- **Palitagem**: Use a classificação mais específica possível
- **Backup**: Exporte dados importantes regularmente
- **Treinamento**: Certifique-se de que todos os usuários conhecem o sistema

## Suporte

Para dúvidas ou problemas:
1. Consulte este manual primeiro
2. Verifique a documentação técnica
3. Entre em contato com o administrador do sistema
4. Reporte bugs ou sugestões para melhorias

---

**Versão do Manual**: 1.0  
**Última Atualização**: Dezembro 2024


## 📤 **UPLOAD EM MASSA DE PALITAGEM**

### Visão Geral

A funcionalidade de upload em massa permite importar grandes quantidades de motivos de palitagem de uma só vez, economizando tempo significativo na configuração inicial do sistema.

### Pré-requisitos

- **Acesso:** Apenas usuários ADMIN podem fazer upload de palitagem
- **Formato:** Arquivos devem estar no formato CSV (separados por vírgula)
- **Codificação:** UTF-8 recomendado para caracteres especiais

### Passo a Passo

#### 1. Acessar a Seção de Palitagem
- Faça login como administrador
- Clique em "Palitagem" no menu lateral
- Escolha a aba desejada (Motivos Macro, Sub-motivos ou Motivos Micro)

#### 2. Baixar o Template
- Clique no botão "Baixar Template"
- O arquivo CSV modelo será baixado automaticamente
- Abra o arquivo em um editor de planilhas (Excel, Google Sheets, etc.)

#### 3. Preencher os Dados
**Para Motivos Macro:**
```csv
id,descricao
MACRO001,Dúvidas Técnicas
MACRO002,Problemas de Sistema
MACRO003,Solicitações
```

**Para Sub-motivos:**
```csv
id,motivo_macro_id,descricao
SUB001,MACRO001,Problemas de Login
SUB002,MACRO001,Configuração de Sistema
SUB003,MACRO002,Sistema Lento
```

**Para Motivos Micro:**
```csv
id,sub_motivo_id,descricao
MICRO001,SUB001,Senha não funciona
MICRO002,SUB001,Usuário bloqueado
MICRO003,SUB002,Como configurar
```

#### 4. Realizar o Upload
- Salve o arquivo preenchido como CSV
- Clique no botão "Upload CSV"
- Selecione seu arquivo CSV
- Aguarde a prévia dos dados aparecer

#### 5. Verificar a Prévia
- Revise os dados na tabela de prévia
- Verifique se todas as informações estão corretas
- Se necessário, cancele e corrija o arquivo

#### 6. Confirmar a Importação
- Clique em "Processar Upload"
- Aguarde a conclusão do processamento
- Verifique o relatório de importação

### Dicas Importantes

#### ✅ **Boas Práticas**
- Use IDs únicos e descritivos (ex: MACRO001, SUB001, MICRO001)
- Mantenha descrições claras e concisas
- Teste com poucos registros primeiro
- Faça backup dos dados existentes antes de importações grandes

#### ⚠️ **Cuidados**
- Não use caracteres especiais nos IDs
- Evite vírgulas nas descrições (use ponto e vírgula se necessário)
- Certifique-se de que os relacionamentos estão corretos
- Não deixe campos obrigatórios vazios

#### 🚫 **Erros Comuns**
- **Colunas ausentes:** Verifique se todas as colunas do template estão presentes
- **IDs duplicados:** Cada ID deve ser único no sistema
- **Relacionamentos inválidos:** Sub-motivos devem referenciar motivos macro existentes
- **Campos vazios:** Todos os campos obrigatórios devem estar preenchidos

### Solução de Problemas

#### Erro: "Colunas obrigatórias ausentes"
- **Causa:** O arquivo CSV não possui todas as colunas necessárias
- **Solução:** Baixe o template novamente e use-o como base

#### Erro: "Dados inválidos"
- **Causa:** Campos obrigatórios estão vazios ou com formato incorreto
- **Solução:** Verifique se todos os campos estão preenchidos corretamente

#### Erro: "Relacionamento não encontrado"
- **Causa:** Sub-motivo referencia um motivo macro que não existe
- **Solução:** Certifique-se de que os motivos macro foram importados primeiro

### Exemplo Completo

Para configurar uma estrutura completa de palitagem:

1. **Primeiro:** Importe os Motivos Macro
2. **Segundo:** Importe os Sub-motivos (referenciando os macros)
3. **Terceiro:** Importe os Motivos Micro (referenciando os sub-motivos)

Esta ordem garante que todos os relacionamentos sejam válidos durante a importação.

