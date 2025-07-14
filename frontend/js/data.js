// Sistema de Gerenciamento de Dados - Versão Cliente-Servidor
class DataManager {
    constructor() {
        this.API_BASE_URL = 'http://localhost:3000/api';
        console.log('DataManager modo API inicializado. Conectando a:', this.API_BASE_URL);
    }

    // Função helper para todas as requisições
    async _fetch(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
                headers: { 'Content-Type': 'application/json' },
                ...options,
            });
            if (!response.ok) {
                throw new Error(`Erro na rede: ${response.statusText}`);
            }
            // Retorna nada para respostas vazias (como DELETE)
            if (response.status === 204) {
                return;
            }
            return response.json();
        } catch (error) {
            console.error(`Erro na requisição para ${endpoint}:`, error);
            utils.showMessage(`Erro de comunicação com o servidor.`, 'error');
            throw error; // Propaga o erro para quem chamou a função
        }
    }

    // --- Métodos para Locais ---
    getLocais() {
        return this._fetch('/locais');
    }

    getLocalById(id) {
        return this._fetch(`/locais/${id}`);
    }

    saveLocal(localData, isNew) {
        if (isNew) {
            return this._fetch('/locais', { method: 'POST', body: JSON.stringify(localData) });
        } else {
            return this._fetch(`/locais/${localData.id}`, { method: 'PUT', body: JSON.stringify(localData) });
        }
    }

    deleteLocal(id) {
        return this._fetch(`/locais/${id}`, { method: 'DELETE' });
    }

    // --- Métodos para Interações ---
    getInteracoes() {
        return this._fetch('/interacoes');
    }

    saveInteracao(interacaoData) {
        // O id e dataHora agora são gerados pelo servidor, não precisamos mais adicionar aqui.
        return this._fetch('/interacoes', { method: 'POST', body: JSON.stringify(interacaoData) });
    }

    // --- Métodos para Palitagem ---
    getMotivosMacro() { return this._fetch('/motivosMacro'); }
    getSubMotivos() { return this._fetch('/subMotivos'); }
    getMotivosMicro() { return this._fetch('/motivosMicro'); }
    
    getSubMotivosByMacro(motivoMacroId) {
        // Esta lógica de filtro continua no frontend para otimização
        return this.getSubMotivos().then(subMotivos => 
            subMotivos.filter(sm => sm.motivoMacroId === motivoMacroId)
        );
    }
    
    getMotivosMicroBySubMotivo(subMotivoId) {
        return this.getMotivosMicro().then(motivosMicro => 
            motivosMicro.filter(mm => mm.subMotivoId === subMotivoId)
        );
    }
    
    // As funções de salvar e deletar palitagem precisarão ser implementadas da mesma forma que saveLocal/deleteLocal
    // Ex: saveMotivosMacro(data) { return this._fetch('/motivosMacro', { method: 'POST', body: JSON.stringify(data) }); }
    
    // --- Métodos para Configurações ---
    // Configurações podem continuar no localStorage se forem específicas do usuário/navegador
    // ou podem ser movidas para o servidor se precisarem ser globais.
    getConfiguracoes() {
        const localConfig = localStorage.getItem('configuracoes_locais') || '{}';
        return JSON.parse(localConfig);
    }

    saveConfiguracoes(config) {
        localStorage.setItem('configuracoes_locais', JSON.stringify(config));
    }
}