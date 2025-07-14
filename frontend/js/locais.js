// Módulo de Gerenciamento de Locais
class LocaisManager {
    constructor() {
        this.currentLocal = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botão novo local
        const novoLocalBtn = document.getElementById('novo-local');
        if (novoLocalBtn) {
            novoLocalBtn.addEventListener('click', () => this.showLocalModal());
        }

        // Botão upload CSV
        const uploadCsvBtn = document.getElementById('upload-csv');
        const csvFileInput = document.getElementById('csv-file');
        if (uploadCsvBtn) {
            uploadCsvBtn.addEventListener('click', () => csvFileInput.click());
        }
        if (csvFileInput) {
            csvFileInput.addEventListener('change', (e) => this.handleCSVUpload(e));
        }
    }

    loadLocais() {
        const locais = dataManager.getLocais();
        const tbody = document.querySelector('#locais-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        locais.forEach(local => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${local.id}</td>
                <td>${local.polo || ''}</td>
                <td>${local.gestor || ''}</td>
                <td>${local.grupo || ''}</td>
                <td>${local.endereco || ''}, ${local.numero || ''}</td>
                <td>${local.telefone1 || ''}</td>
                <td>${local.email || ''}</td>
                <td>
                    <button class="btn btn-secondary" onclick="locaisManager.editLocal('${local.id}')">Editar</button>
                    <button class="btn btn-error" onclick="locaisManager.deleteLocal('${local.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    showLocalModal(localId = null) {
        this.currentLocal = localId ? dataManager.getLocalById(localId) : null;
        const title = this.currentLocal ? 'Editar Local' : 'Novo Local';
        const local = this.currentLocal || {};
        
        const content = `
            <form id="local-form" class="form-container">
                <input type="hidden" id="local-id-hidden" value="${local.id || ''}">
                <div class="form-group">
                    <label for="local-id-input">ID do Local:</label>
                    <input type="text" id="local-id-input" value="${local.id || ''}" ${this.currentLocal ? 'readonly' : ''} required>
                </div>
                <div class="form-group">
                    <label for="local-polo">Polo:</label>
                    <input type="text" id="local-polo" value="${local.polo || ''}" required>
                </div>
                <div class="form-group">
                    <label for="local-gestor">Gestor:</label>
                    <input type="text" id="local-gestor" value="${local.gestor || ''}">
                </div>
                <div class="form-group">
                    <label for="local-email">E-mail:</label>
                    <input type="email" id="local-email" value="${local.email || ''}">
                </div>
                <div class="form-group">
                    <label for="local-telefone1">Telefone:</label>
                    <input type="tel" id="local-telefone1" value="${local.telefone1 || ''}">
                </div>
                 <div class="form-group">
                    <label for="local-endereco">Endereço:</label>
                    <input type="text" id="local-endereco" value="${local.endereco || ''}">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Salvar</button>
                    <button type="button" class="btn btn-secondary" onclick="utils.hideModal()">Cancelar</button>
                </div>
            </form>
        `;
        
        utils.showModal(title, content);
        
        document.getElementById('local-form').addEventListener('submit', (e) => this.saveLocal(e));
    }

    saveLocal(e) {
        e.preventDefault();
        const saveButton = e.target.querySelector('button[type="submit"]');
        utils.setButtonLoading(saveButton, true);

        const localData = {
            id: document.getElementById('local-id-input').value,
            polo: document.getElementById('local-polo').value,
            gestor: document.getElementById('local-gestor').value,
            email: document.getElementById('local-email').value,
            telefone1: document.getElementById('local-telefone1').value,
            endereco: document.getElementById('local-endereco').value,
        };
        
        if (!localData.id || !localData.polo) {
            utils.showMessage('ID do Local e Polo são obrigatórios.', 'error');
            utils.setButtonLoading(saveButton, false);
            return;
        }

        const isNew = !document.getElementById('local-id-hidden').value;
        if (isNew && dataManager.getLocalById(localData.id)) {
            utils.showMessage('Este ID de local já existe.', 'error');
            utils.setButtonLoading(saveButton, false);
            return;
        }

        try {
            dataManager.saveLocal(localData, isNew);
            utils.showMessage(`Local ${isNew ? 'cadastrado' : 'atualizado'} com sucesso!`, 'success');
            utils.hideModal();
            this.loadLocais();
        } catch (error) {
            utils.showMessage(`Erro ao salvar local: ${error.message}`, 'error');
            utils.setButtonLoading(saveButton, false);
        }
    }

    editLocal(localId) {
        this.showLocalModal(localId);
    }

    deleteLocal(localId) {
        if (!confirm('Tem certeza que deseja excluir este local?')) return;

        try {
            dataManager.deleteLocal(localId);
            utils.showMessage('Local excluído com sucesso!');
            this.loadLocais();
        } catch (error) {
            utils.showMessage(`Erro ao excluir local: ${error.message}`, 'error');
        }
    }

    handleCSVUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Implementação de leitura e importação de CSV
        // (Manter a lógica atual ou refatorar para usar um utilitário de upload)
        utils.showMessage('Funcionalidade de Upload em desenvolvimento.', 'warning');
        e.target.value = ''; // Limpar input
    }
}