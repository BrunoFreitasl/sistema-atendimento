# Manual Técnico - Sistema de Atendimento

## Sumário
1. [Arquitetura do Sistema](#arquitetura-do-sistema)
2. [Estrutura de Dados](#estrutura-de-dados)
3. [Módulos JavaScript](#módulos-javascript)
4. [Sistema de Temas](#sistema-de-temas)
5. [Armazenamento de Dados](#armazenamento-de-dados)
6. [APIs e Interfaces](#apis-e-interfaces)
7. [Configuração e Deploy](#configuração-e-deploy)
8. [Manutenção e Debug](#manutenção-e-debug)
9. [Extensibilidade](#extensibilidade)
10. [Troubleshooting](#troubleshooting)

## Arquitetura do Sistema

### Visão Geral
O sistema segue uma arquitetura cliente-servidor simplificada, onde:
- **Frontend**: HTML5 + CSS3 + JavaScript ES6+
- **Backend**: localStorage (navegador)
- **Persistência**: JSON no localStorage
- **Autenticação**: Session-based local

### Padrões Utilizados
- **Module Pattern**: Cada funcionalidade em classe separada
- **Observer Pattern**: Eventos para comunicação entre módulos
- **MVC Simplificado**: Separação de dados, visualização e controle
- **Progressive Enhancement**: Funciona sem JavaScript (parcialmente)

### Fluxo de Dados
```
User Input → JavaScript Module → DataManager → localStorage → UI Update
```

## Estrutura de Dados

### Usuários (users)
```javascript
{
  id: "string",           // ID único gerado
  name: "string",         // Nome completo
  username: "string",     // Login único
  password: "string",     // Senha (texto simples)
  role: "admin|atendente", // Nível de acesso
  createdAt: "ISO string", // Data de criação
  active: boolean         // Status ativo/inativo
}
```

### Locais (locais)
```javascript
{
  id: "string",              // ID único do local
  polo: "string",            // Nome do polo
  gestor: "string",          // Nome do gestor
  grupo: "string",           // Grupo/categoria
  endereco: "string",        // Endereço
  numero: "string",          // Número
  complemento: "string",     // Complemento
  bairro: "string",          // Bairro
  precificacao: "string",    // Tipo de precificação
  email: "string",           // E-mail
  telefone1: "string",       // Telefone principal
  telefone2: "string",       // Telefone secundário
  head: "string",            // Head responsável
  gerente: "string",         // Gerente
  consultorExterno: "string", // Consultor externo
  consultorInterno: "string"  // Consultor interno
}
```

### Interações (interacoes)
```javascript
{
  id: "string",           // ID único gerado
  dataHora: "ISO string", // Timestamp da criação
  usuario: "string",      // Nome do usuário
  usuarioId: "string",    // ID do usuário
  localId: "string",      // ID do local
  local: Object,          // Dados completos do local
  pessoaContatada: "string", // Nome da pessoa contatada
  descricao: "string",    // Descrição do atendimento
  duvidas: [              // Array de dúvidas
    {
      motivoMacro: {
        id: "string",
        descricao: "string"
      },
      subMotivo: {
        id: "string", 
        descricao: "string"
      },
      motivoMicro: {
        id: "string",
        descricao: "string"
      }
    }
  ]
}
```

### Palitagem
```javascript
// Motivos Macro (motivosMacro)
{
  id: "string",        // ID único (ex: "MM001")
  descricao: "string"  // Descrição do motivo
}

// Sub-motivos (subMotivos)
{
  id: "string",           // ID único (ex: "SM001")
  motivoMacroId: "string", // ID do motivo macro pai
  descricao: "string"     // Descrição do sub-motivo
}

// Motivos Micro (motivosMicro)
{
  id: "string",        // ID único (ex: "MI001")
  subMotivoId: "string", // ID do sub-motivo pai
  descricao: "string"  // Descrição do motivo micro
}
```

### Configurações (configuracoes)
```javascript
{
  welcomeTitle: "string",    // Título da mensagem de boas-vindas
  welcomeText: "string",     // Texto da mensagem
  camposObrigatorios: {      // Campos obrigatórios
    pessoaContatada: boolean,
    descricao: boolean,
    motivoMacro: boolean,
    subMotivo: boolean,
    motivoMicro: boolean
  },
  funcionalidadesAtivas: {   // Funcionalidades ativas
    multiplasDuvidas: boolean,
    uploadCSV: boolean,
    exportacao: boolean
  }
}
```

### Tema (themeSettings)
```javascript
{
  theme: "string",      // Tema atual (azul, verde, roxo, cinza)
  customColor: "string" // Cor personalizada (hex)
}
```

## Módulos JavaScript

### AuthSystem (auth.js)
**Responsabilidade**: Gerenciamento de autenticação e autorização

**Métodos Principais**:
- `login(username, password)`: Autentica usuário
- `logout()`: Encerra sessão
- `createUser(userData)`: Cria novo usuário
- `updateUser(userId, userData)`: Atualiza usuário
- `deleteUser(userId)`: Remove usuário
- `isLoggedIn()`: Verifica se está logado
- `isAdmin()`: Verifica se é admin

**Eventos**:
- Criação automática de usuários padrão
- Validação de permissões
- Persistência de sessão

### ThemeSystem (theme.js)
**Responsabilidade**: Gerenciamento de temas e personalização visual

**Métodos Principais**:
- `setTheme(theme)`: Define tema pré-definido
- `setCustomColor(color)`: Define cor personalizada
- `setCustomLogo(file)`: Define logo personalizado
- `applyTheme()`: Aplica tema atual
- `loadSettings()`: Carrega configurações salvas

**Funcionalidades**:
- Conversão de cores (hex ↔ rgb ↔ hsl)
- Geração de variações de cor
- Persistência de configurações

### DataManager (data.js)
**Responsabilidade**: Gerenciamento de dados e persistência

**Métodos Principais**:
- `getLocais()`, `saveLocal()`, `deleteLocal()`
- `getInteracoes()`, `saveInteracao()`
- `getMotivosMacro()`, `saveMotivosMacro()`
- `exportToCSV()`, `exportToXML()`
- `importLocaisFromCSV()`

**Funcionalidades**:
- CRUD completo para todas as entidades
- Exportação/importação de dados
- Geração de IDs únicos
- Validação de dados

### InteracoesManager (interacoes.js)
**Responsabilidade**: Gerenciamento de interações de atendimento

**Métodos Principais**:
- `buscarLocal()`: Busca local por ID
- `adicionarDuvida()`: Adiciona nova dúvida
- `salvarInteracao()`: Salva interação completa
- `loadHistorico()`: Carrega histórico
- `aplicarFiltros()`: Aplica filtros de busca

**Funcionalidades**:
- Formulário dinâmico de dúvidas
- Validação de palitagem
- Busca automática de locais
- Filtros avançados

### LocaisManager (locais.js)
**Responsabilidade**: Gerenciamento de locais

**Métodos Principais**:
- `showLocalModal()`: Exibe modal de cadastro/edição
- `saveLocal()`: Salva local
- `deleteLocal()`: Remove local
- `handleCSVUpload()`: Processa upload CSV
- `exportLocaisToCSV()`: Exporta locais

### ColaboradoresManager (colaboradores.js)
**Responsabilidade**: Gerenciamento de colaboradores

**Métodos Principais**:
- `showColaboradorModal()`: Modal de cadastro/edição
- `saveColaborador()`: Salva colaborador
- `deleteColaborador()`: Remove colaborador
- `changePassword()`: Altera senha

### PalitagemManager (palitagem.js)
**Responsabilidade**: Gerenciamento do sistema de palitagem

**Métodos Principais**:
- `loadMotivosMacro()`, `saveMotivoMacro()`
- `loadSubMotivos()`, `saveSubMotivo()`
- `loadMotivosMicro()`, `saveMotivoMicro()`
- `setupTabs()`: Configuração das abas

### RelatoriosManager (relatorios.js)
**Responsabilidade**: Geração de relatórios e estatísticas

**Métodos Principais**:
- `gerarRelatorio()`: Gera relatório filtrado
- `exportarCSV()`, `exportarXML()`: Exportação
- `gerarRelatorioEstatisticas()`: Estatísticas do sistema
- `aplicarFiltrosRelatorio()`: Filtros específicos

### ConfiguracoesManager (configuracoes.js)
**Responsabilidade**: Configurações do sistema

**Métodos Principais**:
- `salvarConfiguracoes()`: Salva configurações
- `handleLogoUpload()`: Upload de logo
- `exportConfiguracoes()`: Backup de configurações
- `importConfiguracoes()`: Restauração de backup

## Sistema de Temas

### Variáveis CSS
O sistema utiliza CSS Custom Properties para temas:

```css
:root {
  --primary-color: #2563EB;
  --primary-dark: #1D4ED8;
  --primary-light: #3B82F6;
  --secondary-color: #64748B;
  --success-color: #10B981;
  --warning-color: #F59E0B;
  --error-color: #EF4444;
  --background-color: #F8FAFC;
  --surface-color: #FFFFFF;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --border-color: #E2E8F0;
}
```

### Temas Pré-definidos
- **Azul** (padrão): `#2563EB`
- **Verde**: `#059669`
- **Roxo**: `#7C3AED`
- **Cinza**: `#374151`

### Aplicação de Temas
```javascript
// Aplicar tema pré-definido
document.body.setAttribute('data-theme', 'verde');

// Aplicar cor personalizada
document.documentElement.style.setProperty('--primary-color', '#FF5722');
```

## Armazenamento de Dados

### localStorage Keys
- `users`: Array de usuários
- `currentUser`: Usuário logado atual
- `locais`: Array de locais
- `interacoes`: Array de interações
- `motivosMacro`: Array de motivos macro
- `subMotivos`: Array de sub-motivos
- `motivosMicro`: Array de motivos micro
- `configuracoes`: Objeto de configurações
- `themeSettings`: Configurações de tema
- `customLogo`: Logo personalizado (base64)

### Limitações do localStorage
- **Tamanho**: ~5-10MB por domínio
- **Sincronização**: Apenas local, não sincroniza
- **Persistência**: Pode ser limpo pelo usuário
- **Tipo**: Apenas strings (JSON.stringify/parse)

### Estratégias de Otimização
```javascript
// Compressão de dados grandes
const compressData = (data) => {
  return JSON.stringify(data, null, 0); // Remove espaços
};

// Limpeza periódica
const cleanOldData = () => {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - 6);
  // Remove interações antigas
};
```

## APIs e Interfaces

### Interface DataManager
```javascript
class DataManager {
  // CRUD Genérico
  get(key) { return JSON.parse(localStorage.getItem(key) || '[]'); }
  set(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
  
  // Métodos específicos
  getLocais() { /* ... */ }
  saveLocal(data) { /* ... */ }
  deleteLocal(id) { /* ... */ }
  
  // Exportação
  exportToCSV(data, filename) { /* ... */ }
  exportToXML(data, filename, root) { /* ... */ }
}
```

### Interface AuthSystem
```javascript
class AuthSystem {
  login(username, password) {
    // Retorna: { success: boolean, user?: Object, message?: string }
  }
  
  createUser(userData) {
    // Retorna: { success: boolean, user?: Object, message?: string }
  }
  
  requireAuth() {
    // Redireciona se não autenticado
    // Retorna: boolean
  }
}
```

### Eventos Customizados
```javascript
// Disparar evento
document.dispatchEvent(new CustomEvent('userLoggedIn', {
  detail: { user: currentUser }
}));

// Escutar evento
document.addEventListener('userLoggedIn', (e) => {
  console.log('Usuário logado:', e.detail.user);
});
```

## Configuração e Deploy

### Requisitos Mínimos
- Navegador com suporte a ES6+
- JavaScript habilitado
- localStorage disponível
- ~10MB de espaço livre

### Deploy Local
1. Extrair arquivos em diretório
2. Abrir `index.html` no navegador
3. Configurar usuários iniciais

### Deploy em Servidor Web
```apache
# .htaccess para Apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# Headers de segurança
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
```

### Configuração Nginx
```nginx
server {
    listen 80;
    server_name sistema-atendimento.local;
    root /var/www/sistema-atendimento;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache para assets estáticos
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Manutenção e Debug

### Debug Mode
```javascript
// Ativar debug
localStorage.setItem('debug', 'true');

// Logs condicionais
const debug = localStorage.getItem('debug') === 'true';
if (debug) console.log('Debug info:', data);
```

### Monitoramento de Performance
```javascript
// Medir tempo de operações
const startTime = performance.now();
// ... operação ...
const endTime = performance.now();
console.log(`Operação levou ${endTime - startTime} ms`);

// Monitorar uso de localStorage
const usage = JSON.stringify(localStorage).length;
const limit = 5 * 1024 * 1024; // 5MB
const percentage = (usage / limit) * 100;
console.log(`localStorage: ${percentage.toFixed(2)}% usado`);
```

### Backup Automático
```javascript
const autoBackup = () => {
  const data = {
    users: dataManager.getUsers(),
    locais: dataManager.getLocais(),
    interacoes: dataManager.getInteracoes(),
    // ... outros dados
  };
  
  const backup = JSON.stringify(data);
  const blob = new Blob([backup], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Download automático
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
};

// Executar backup semanal
setInterval(autoBackup, 7 * 24 * 60 * 60 * 1000);
```

## Extensibilidade

### Adicionando Novos Módulos
```javascript
class NovoModulo {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.loadData();
  }
  
  setupEventListeners() {
    // Configurar eventos
  }
  
  loadData() {
    // Carregar dados necessários
  }
}

// Registrar módulo globalmente
window.novoModulo = new NovoModulo();
```

### Hooks para Extensões
```javascript
// Sistema de hooks
const hooks = {
  beforeSave: [],
  afterSave: [],
  beforeDelete: [],
  afterDelete: []
};

const addHook = (event, callback) => {
  hooks[event].push(callback);
};

const runHooks = (event, data) => {
  hooks[event].forEach(callback => callback(data));
};

// Uso
addHook('beforeSave', (data) => {
  console.log('Salvando:', data);
});
```

### Plugin System
```javascript
const PluginManager = {
  plugins: [],
  
  register(plugin) {
    this.plugins.push(plugin);
    plugin.init();
  },
  
  execute(hook, data) {
    this.plugins.forEach(plugin => {
      if (plugin[hook]) plugin[hook](data);
    });
  }
};

// Plugin exemplo
const ExamplePlugin = {
  init() {
    console.log('Plugin inicializado');
  },
  
  beforeSave(data) {
    // Processar dados antes de salvar
  }
};

PluginManager.register(ExamplePlugin);
```

## Troubleshooting

### Problemas Comuns

#### 1. Dados não carregam
```javascript
// Verificar localStorage
console.log('localStorage disponível:', typeof Storage !== 'undefined');
console.log('Dados:', Object.keys(localStorage));

// Verificar JSON válido
try {
  JSON.parse(localStorage.getItem('users'));
} catch (e) {
  console.error('JSON inválido:', e);
  localStorage.removeItem('users');
}
```

#### 2. Performance lenta
```javascript
// Verificar tamanho dos dados
const checkDataSize = () => {
  Object.keys(localStorage).forEach(key => {
    const size = localStorage.getItem(key).length;
    console.log(`${key}: ${(size / 1024).toFixed(2)} KB`);
  });
};

// Otimizar consultas
const optimizeQueries = () => {
  // Cache em memória para dados frequentes
  const cache = new Map();
  
  const getCached = (key) => {
    if (!cache.has(key)) {
      cache.set(key, JSON.parse(localStorage.getItem(key) || '[]'));
    }
    return cache.get(key);
  };
};
```

#### 3. Erros de JavaScript
```javascript
// Error handler global
window.addEventListener('error', (e) => {
  console.error('Erro global:', e.error);
  // Reportar erro ou mostrar mensagem amigável
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
  console.error('Promise rejeitada:', e.reason);
});
```

### Ferramentas de Debug

#### Console Commands
```javascript
// Adicionar ao console para debug
window.debugUtils = {
  clearData: () => localStorage.clear(),
  exportData: () => JSON.stringify(localStorage),
  importData: (data) => {
    const parsed = JSON.parse(data);
    Object.keys(parsed).forEach(key => {
      localStorage.setItem(key, parsed[key]);
    });
  },
  resetToDefaults: () => {
    localStorage.clear();
    location.reload();
  }
};
```

#### Performance Monitor
```javascript
const PerformanceMonitor = {
  start(label) {
    console.time(label);
  },
  
  end(label) {
    console.timeEnd(label);
  },
  
  memory() {
    if (performance.memory) {
      console.log('Memória:', {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(performance.memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + ' MB'
      });
    }
  }
};
```

### Logs Estruturados
```javascript
const Logger = {
  levels: { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 },
  currentLevel: 2,
  
  log(level, message, data = {}) {
    if (this.levels[level] <= this.currentLevel) {
      console.log(`[${level}] ${new Date().toISOString()} - ${message}`, data);
    }
  },
  
  error: (msg, data) => Logger.log('ERROR', msg, data),
  warn: (msg, data) => Logger.log('WARN', msg, data),
  info: (msg, data) => Logger.log('INFO', msg, data),
  debug: (msg, data) => Logger.log('DEBUG', msg, data)
};
```

---

**Versão do Manual**: 1.0  
**Última Atualização**: Dezembro 2024

