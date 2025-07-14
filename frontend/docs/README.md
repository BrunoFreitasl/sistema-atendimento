# Sistema de Registro de Interações de Atendimento

## Visão Geral

O Sistema de Registro de Interações de Atendimento é uma aplicação web completa desenvolvida para gerenciar e registrar interações de atendimento ao cliente. O sistema oferece diferentes níveis de acesso (Administrador e Atendente) e funcionalidades abrangentes para cadastro, consulta e relatórios.

## Características Principais

### 🔐 Sistema de Autenticação
- Login seguro com usuário e senha
- Dois níveis de acesso: Administrador e Atendente
- Sessão persistente com logout seguro

### 👥 Gerenciamento de Usuários
- Cadastro e edição de colaboradores
- Controle de níveis de acesso
- Alteração de senhas
- Ativação/desativação de usuários

### 🏢 Gerenciamento de Locais
- Cadastro completo de locais com 16 campos
- Busca automática por ID
- Upload em massa via arquivo CSV
- Exportação de dados

### 📝 Registro de Interações
- Formulário intuitivo para nova interação
- Sistema de palitagem em três níveis (Macro > Sub > Micro)
- Suporte a múltiplas dúvidas por interação
- Validação automática de dados

### 📊 Sistema de Relatórios
- Histórico personalizado para cada usuário
- Relatórios completos para administradores
- Filtros por data, local e colaborador
- Exportação em CSV e XML

### 🎨 Personalização
- Quatro temas pré-definidos (Azul, Verde, Roxo, Cinza)
- Cor personalizada
- Upload de logo da empresa
- Mensagens de boas-vindas customizáveis
- Interface responsiva

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Armazenamento**: localStorage (navegador)
- **Design**: CSS Grid, Flexbox, Variáveis CSS
- **Compatibilidade**: Navegadores modernos

## Estrutura do Projeto

```
sistema-atendimento/
├── index.html              # Página de login
├── dashboard.html           # Dashboard principal
├── css/
│   ├── styles.css          # Estilos globais
│   ├── login.css           # Estilos do login
│   └── dashboard.css       # Estilos do dashboard
├── js/
│   ├── auth.js             # Sistema de autenticação
│   ├── theme.js            # Sistema de temas
│   ├── data.js             # Gerenciamento de dados
│   ├── main.js             # Script principal
│   ├── login.js            # Lógica do login
│   ├── dashboard.js        # Lógica do dashboard
│   ├── interacoes.js       # Gerenciamento de interações
│   ├── locais.js           # Gerenciamento de locais
│   ├── colaboradores.js    # Gerenciamento de colaboradores
│   ├── palitagem.js        # Sistema de palitagem
│   ├── relatorios.js       # Sistema de relatórios
│   └── configuracoes.js    # Configurações do sistema
├── data/                   # Dados iniciais (gerados automaticamente)
└── docs/                   # Documentação
    ├── README.md           # Este arquivo
    ├── manual-usuario.md   # Manual do usuário
    └── manual-tecnico.md   # Manual técnico
```

## Instalação e Configuração

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desenvolvimento)

### Instalação
1. Extraia todos os arquivos em um diretório
2. Abra o arquivo `index.html` em um navegador web
3. Use as credenciais padrão para primeiro acesso:
   - **Admin**: usuário `admin`, senha `admin123`
   - **Atendente**: usuário `atendente`, senha `123456`

### Configuração Inicial
1. Faça login como administrador
2. Acesse "Configurações" no menu lateral
3. Personalize o logo, cores e mensagens
4. Cadastre novos colaboradores conforme necessário
5. Configure os dados de palitagem conforme sua necessidade

## Funcionalidades por Nível de Acesso

### Administrador
- ✅ Todas as funcionalidades do sistema
- ✅ Gerenciamento de colaboradores
- ✅ Gerenciamento de locais
- ✅ Configuração de palitagem
- ✅ Relatórios completos
- ✅ Configurações do sistema
- ✅ Exportação de dados

### Atendente
- ✅ Registro de novas interações
- ✅ Visualização do próprio histórico
- ✅ Configurações básicas de tema
- ❌ Gerenciamento de usuários
- ❌ Relatórios administrativos
- ❌ Configurações avançadas

## Dados Padrão

O sistema vem pré-configurado com:
- 2 usuários (admin e atendente)
- 3 locais de exemplo
- Sistema de palitagem com 5 motivos macro, 10 sub-motivos e 20 motivos micro

## Backup e Restauração

### Backup
- Os dados são armazenados no localStorage do navegador
- Use a função "Exportar Configurações" para backup completo
- Exporte dados específicos via relatórios

### Restauração
- Use a função "Importar Configurações" para restaurar backup
- Dados são restaurados automaticamente no localStorage

## Suporte e Manutenção

### Limpeza de Dados
- Acesse as configurações avançadas para gerenciar dados
- Use a função de reset para limpar completamente o sistema

### Resolução de Problemas
- Verifique se JavaScript está habilitado no navegador
- Limpe o cache do navegador se houver problemas de carregamento
- Verifique o console do navegador para erros

## Segurança

- Senhas são armazenadas em texto simples (adequado para ambiente local)
- Dados ficam restritos ao navegador local
- Sistema não requer conexão com internet após carregamento inicial

## Limitações

- Armazenamento limitado pelo localStorage do navegador (~5-10MB)
- Dados ficam restritos ao navegador/computador específico
- Não há sincronização entre diferentes dispositivos
- Backup manual necessário para preservar dados

## Versão

**Versão 1.0** - Sistema completo com todas as funcionalidades solicitadas

## Licença

Sistema desenvolvido especificamente para uso interno da empresa.



## 🔄 **UPLOAD EM MASSA DE PALITAGEM**

### Funcionalidade de Upload CSV

O sistema agora suporta upload em massa para todos os níveis de palitagem:

#### **Motivos Macro**
- **Template:** `id, descricao`
- **Exemplo:** `MACRO001, Dúvidas Técnicas`
- **Botões:** Upload CSV | Baixar Template

#### **Sub-motivos**
- **Template:** `id, motivo_macro_id, descricao`
- **Exemplo:** `SUB001, MACRO001, Problemas de Login`
- **Botões:** Upload CSV | Baixar Template

#### **Motivos Micro**
- **Template:** `id, sub_motivo_id, descricao`
- **Exemplo:** `MICRO001, SUB001, Senha não funciona`
- **Botões:** Upload CSV | Baixar Template

### Como Usar o Upload

1. **Baixar Template:** Clique em "Baixar Template" para obter o arquivo CSV modelo
2. **Preencher Dados:** Complete o arquivo CSV com seus dados
3. **Upload:** Clique em "Upload CSV" e selecione seu arquivo
4. **Prévia:** Visualize os dados antes de confirmar
5. **Processar:** Confirme o upload para importar os dados

### Validações

- **Colunas obrigatórias:** Todas as colunas do template devem estar presentes
- **Dados válidos:** IDs e descrições não podem estar vazios
- **Relacionamentos:** Sub-motivos devem referenciar motivos macro existentes
- **Motivos micro:** Devem referenciar sub-motivos existentes

### Relatório de Importação

Após o upload, o sistema exibe:
- Número de itens importados com sucesso
- Número de erros encontrados
- Detalhes dos primeiros 5 erros (se houver)


