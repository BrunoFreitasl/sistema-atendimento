// Módulo de Configurações
class ConfiguracoesManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadConfiguracoes();
    }

    setupEventListeners() {
        // Salvar configurações
        const salvarConfigBtn = document.getElementById('salvar-configuracoes');
        if (salvarConfigBtn) {
            salvarConfigBtn.addEventListener('click', () => this.salvarConfiguracoes());
        }

        // Seletor de tema
        const temaSelect = document.getElementById('tema-select');
        if (temaSelect) {
            temaSelect.addEventListener('change', (e) => {
                themeSystem.setTheme(e.target.value);
            });
        }

        // Cor personalizada
        const corPersonalizadaInput = document.getElementById('cor-personalizada');
        if (corPersonalizadaInput) {
            corPersonalizadaInput.addEventListener('change', (e) => {
                themeSystem.setCustomColor(e.target.value);
            });
        }

        // Upload de logo
        const logoUploadInput = document.getElementById('logo-upload');
        if (logoUploadInput) {
            logoUploadInput.addEventListener('change', (e) => this.handleLogoUpload(e));
        }
    }

    loadConfiguracoes() {
        const config = dataManager.getConfiguracoes();
        
        // Carregar mensagens de boas-vindas
        const welcomeTitleInput = document.getElementById('welcome-title-config');
        if (welcomeTitleInput) {
            welcomeTitleInput.value = config.welcomeTitle;
        }

        const welcomeTextInput = document.getElementById('welcome-text-config');
        if (welcomeTextInput) {
            welcomeTextInput.value = config.welcomeText;
        }

        // Carregar configurações de tema
        const temaSelect = document.getElementById('tema-select');
        if (temaSelect) {
            temaSelect.value = themeSystem.currentTheme;
        }

        const corPersonalizadaInput = document.getElementById('cor-personalizada');
        if (corPersonalizadaInput) {
            corPersonalizadaInput.value = themeSystem.customColor;
        }
    }

    salvarConfiguracoes() {
        const welcomeTitle = document.getElementById('welcome-title-config').value;
        const welcomeText = document.getElementById('welcome-text-config').value;
        
        // Validações
        if (!welcomeTitle || !welcomeText) {
            utils.showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Obter configurações atuais
        const config = dataManager.getConfiguracoes();
        
        // Atualizar configurações
        config.welcomeTitle = welcomeTitle;
        config.welcomeText = welcomeText;
        
        // Salvar configurações
        dataManager.saveConfiguracoes(config);
        
        // Atualizar interface
        this.updateWelcomeMessages(welcomeTitle, welcomeText);
        
        utils.showMessage('Configurações salvas com sucesso!');
    }

    updateWelcomeMessages(title, text) {
        const welcomeTitleElement = document.getElementById('welcome-title');
        if (welcomeTitleElement) {
            welcomeTitleElement.textContent = title;
        }
        
        const welcomeTextElement = document.getElementById('welcome-text');
        if (welcomeTextElement) {
            welcomeTextElement.textContent = text;
        }
    }

    handleLogoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        themeSystem.setCustomLogo(file)
            .then(() => {
                utils.showMessage('Logo atualizado com sucesso!');
            })
            .catch((error) => {
                utils.showMessage('Erro ao atualizar logo: ' + error, 'error');
            });
    }

    exportConfiguracoes() {
        const config = dataManager.getConfiguracoes();
        const themeSettings = JSON.parse(localStorage.getItem('themeSettings') || '{}');
        const customLogo = localStorage.getItem('customLogo');
        
        const exportData = {
            configuracoes: config,
            tema: themeSettings,
            logo: customLogo,
            dataExportacao: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const filename = `configuracoes_sistema_${new Date().toISOString().split('T')[0]}.json`;
        
        dataManager.downloadFile(dataStr, filename, 'application/json');
        utils.showMessage('Configurações exportadas com sucesso!');
    }

    importConfiguracoes(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject('Nenhum arquivo selecionado');
                return;
            }

            if (!file.name.toLowerCase().endsWith('.json')) {
                reject('Arquivo deve ser um JSON válido');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    // Validar estrutura do arquivo
                    if (!importData.configuracoes) {
                        reject('Arquivo de configuração inválido');
                        return;
                    }

                    // Importar configurações
                    if (importData.configuracoes) {
                        dataManager.saveConfiguracoes(importData.configuracoes);
                    }

                    // Importar tema
                    if (importData.tema) {
                        localStorage.setItem('themeSettings', JSON.stringify(importData.tema));
                        themeSystem.loadSettings();
                        themeSystem.applyTheme();
                    }

                    // Importar logo
                    if (importData.logo) {
                        localStorage.setItem('customLogo', importData.logo);
                        themeSystem.loadCustomLogo();
                    }

                    // Recarregar configurações na interface
                    this.loadConfiguracoes();
                    
                    resolve('Configurações importadas com sucesso!');
                } catch (error) {
                    reject('Erro ao processar arquivo: ' + error.message);
                }
            };
            reader.onerror = () => reject('Erro ao ler arquivo');
            reader.readAsText(file);
        });
    }

    resetConfiguracoes() {
        if (!confirm('Tem certeza que deseja resetar todas as configurações? Esta ação não pode ser desfeita.')) {
            return;
        }

        // Resetar configurações
        localStorage.removeItem('configuracoes');
        localStorage.removeItem('themeSettings');
        localStorage.removeItem('customLogo');

        // Recarregar sistemas
        themeSystem.currentTheme = 'azul';
        themeSystem.customColor = '#2563EB';
        themeSystem.applyTheme();
        themeSystem.loadCustomLogo();

        // Recarregar interface
        this.loadConfiguracoes();
        
        utils.showMessage('Configurações resetadas com sucesso!');
    }

    showImportModal() {
        const content = `
            <div class="import-config-container">
                <p>Selecione um arquivo de configuração para importar:</p>
                
                <div class="form-group">
                    <input type="file" id="import-config-file" accept=".json">
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="configuracoesManager.processImport()">Importar</button>
                    <button type="button" class="btn btn-secondary" onclick="utils.hideModal()">Cancelar</button>
                </div>
                
                <div class="import-warning">
                    <p><strong>Atenção:</strong> A importação substituirá todas as configurações atuais.</p>
                </div>
            </div>
        `;

        utils.showModal('Importar Configurações', content);
    }

    processImport() {
        const fileInput = document.getElementById('import-config-file');
        const file = fileInput.files[0];

        this.importConfiguracoes(file)
            .then((message) => {
                utils.showMessage(message);
                utils.hideModal();
            })
            .catch((error) => {
                utils.showMessage(error, 'error');
            });
    }

    showAdvancedSettings() {
        const config = dataManager.getConfiguracoes();
        
        const content = `
            <div class="advanced-settings-container">
                <h3>Configurações Avançadas</h3>
                
                <div class="config-section">
                    <h4>Campos Obrigatórios</h4>
                    <div class="checkbox-group">
                        <label>
                            <input type="checkbox" id="campo-pessoa-contatada" ${config.camposObrigatorios.pessoaContatada ? 'checked' : ''}>
                            Pessoa Contatada
                        </label>
                        <label>
                            <input type="checkbox" id="campo-descricao" ${config.camposObrigatorios.descricao ? 'checked' : ''}>
                            Descrição
                        </label>
                        <label>
                            <input type="checkbox" id="campo-motivo-macro" ${config.camposObrigatorios.motivoMacro ? 'checked' : ''}>
                            Motivo Macro
                        </label>
                        <label>
                            <input type="checkbox" id="campo-sub-motivo" ${config.camposObrigatorios.subMotivo ? 'checked' : ''}>
                            Sub-motivo
                        </label>
                        <label>
                            <input type="checkbox" id="campo-motivo-micro" ${config.camposObrigatorios.motivoMicro ? 'checked' : ''}>
                            Motivo Micro
                        </label>
                    </div>
                </div>
                
                <div class="config-section">
                    <h4>Funcionalidades Ativas</h4>
                    <div class="checkbox-group">
                        <label>
                            <input type="checkbox" id="func-multiplas-duvidas" ${config.funcionalidadesAtivas.multiplasDuvidas ? 'checked' : ''}>
                            Múltiplas Dúvidas
                        </label>
                        <label>
                            <input type="checkbox" id="func-upload-csv" ${config.funcionalidadesAtivas.uploadCSV ? 'checked' : ''}>
                            Upload CSV
                        </label>
                        <label>
                            <input type="checkbox" id="func-exportacao" ${config.funcionalidadesAtivas.exportacao ? 'checked' : ''}>
                            Exportação de Dados
                        </label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="configuracoesManager.saveAdvancedSettings()">Salvar</button>
                    <button type="button" class="btn btn-secondary" onclick="utils.hideModal()">Cancelar</button>
                </div>
            </div>
        `;

        utils.showModal('Configurações Avançadas', content);
    }

    saveAdvancedSettings() {
        const config = dataManager.getConfiguracoes();
        
        // Atualizar campos obrigatórios
        config.camposObrigatorios = {
            pessoaContatada: document.getElementById('campo-pessoa-contatada').checked,
            descricao: document.getElementById('campo-descricao').checked,
            motivoMacro: document.getElementById('campo-motivo-macro').checked,
            subMotivo: document.getElementById('campo-sub-motivo').checked,
            motivoMicro: document.getElementById('campo-motivo-micro').checked
        };
        
        // Atualizar funcionalidades ativas
        config.funcionalidadesAtivas = {
            multiplasDuvidas: document.getElementById('func-multiplas-duvidas').checked,
            uploadCSV: document.getElementById('func-upload-csv').checked,
            exportacao: document.getElementById('func-exportacao').checked
        };
        
        dataManager.saveConfiguracoes(config);
        utils.showMessage('Configurações avançadas salvas com sucesso!');
        utils.hideModal();
    }
}