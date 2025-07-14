// Módulo de Gerenciamento de Palitagem
class PalitagemManager {
    constructor() {
        this.currentTab = 'motivos-macro';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTabs();
    }

    setupEventListeners() {
        document.getElementById('novo-motivo-macro')?.addEventListener('click', () => this.showMotivoMacroModal());
        document.getElementById('novo-sub-motivo')?.addEventListener('click', () => this.showSubMotivoModal());
        document.getElementById('novo-motivo-micro')?.addEventListener('click', () => this.showMotivoMicroModal());
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentTab = btn.dataset.tab;
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(`${this.currentTab}-tab`)?.classList.add('active');
                
                this.loadTabData(this.currentTab);
            });
        });
        this.loadTabData(this.currentTab);
    }

    loadTabData(tab) {
        switch (tab) {
            case 'motivos-macro': this.loadMotivosMacro(); break;
            case 'sub-motivos': this.loadSubMotivos(); break;
            case 'motivos-micro': this.loadMotivosMicro(); break;
        }
    }

    // --- Renderização das Tabelas ---
    loadMotivosMacro() {
        const data = dataManager.getMotivosMacro();
        const tbody = document.querySelector('#motivos-macro-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        data.forEach(item => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.descricao}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="palitagemManager.showMotivoMacroModal('${item.id}')">Editar</button>
                    <button class="btn btn-error btn-sm" onclick="palitagemManager.deleteMotivoMacro('${item.id}')">Excluir</button>
                </td>`;
        });
    }

    loadSubMotivos() {
        const data = dataManager.getSubMotivos();
        const motivosMacro = dataManager.getMotivosMacro();
        const macroMap = new Map(motivosMacro.map(m => [m.id, m.descricao]));
        const tbody = document.querySelector('#sub-motivos-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        data.forEach(item => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${macroMap.get(item.motivoMacroId) || 'N/A'}</td>
                <td>${item.descricao}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="palitagemManager.showSubMotivoModal('${item.id}')">Editar</button>
                    <button class="btn btn-error btn-sm" onclick="palitagemManager.deleteSubMotivo('${item.id}')">Excluir</button>
                </td>`;
        });
    }

    loadMotivosMicro() {
        const data = dataManager.getMotivosMicro();
        const subMotivos = dataManager.getSubMotivos();
        const subMap = new Map(subMotivos.map(s => [s.id, s.descricao]));
        const tbody = document.querySelector('#motivos-micro-table tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        data.forEach(item => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${subMap.get(item.subMotivoId) || 'N/A'}</td>
                <td>${item.descricao}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="palitagemManager.showMotivoMicroModal('${item.id}')">Editar</button>
                    <button class="btn btn-error btn-sm" onclick="palitagemManager.deleteMotivoMicro('${item.id}')">Excluir</button>
                </td>`;
        });
    }

    // --- Modais e Ações ---
    // Motivo Macro
    showMotivoMacroModal(id = null) {
        const item = id ? dataManager.getMotivosMacro().find(m => m.id === id) : null;
        const title = item ? 'Editar Motivo Macro' : 'Novo Motivo Macro';
        const content = `
            <form id="palitagem-form" class="form-container">
                <input type="hidden" name="id_hidden" value="${item?.id || ''}">
                <div class="form-group">
                    <label for="id">ID:</label>
                    <input type="text" id="id" name="id" value="${item?.id || ''}" ${item ? 'readonly' : ''} required>
                </div>
                <div class="form-group">
                    <label for="descricao">Descrição:</label>
                    <input type="text" id="descricao" name="descricao" value="${item?.descricao || ''}" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>`;
        utils.showModal(title, content);
        document.getElementById('palitagem-form').addEventListener('submit', (e) => this.saveMotivoMacro(e));
    }

    saveMotivoMacro(e) {
        e.preventDefault();
        const form = e.target;
        const button = form.querySelector('button[type="submit"]');
        utils.setButtonLoading(button, true);

        const id = form.elements.id.value.trim();
        const isNew = !form.elements.id_hidden.value;

        const data = { id, descricao: form.elements.descricao.value.trim() };
        
        const all = dataManager.getMotivosMacro();
        if (isNew && all.some(item => item.id === id)) {
            utils.showMessage('Este ID já está em uso.', 'error');
            utils.setButtonLoading(button, false);
            return;
        }

        const success = dataManager.saveMotivosMacro(isNew ? [...all, data] : all.map(i => i.id === id ? data : i));
        this.postSave(success, button);
    }

    deleteMotivoMacro(id) {
        if (!confirm('Excluir este motivo irá remover todos os sub-motivos e motivos-micro associados. Deseja continuar?')) return;
        dataManager.deleteMotivoMacro(id);
        this.loadMotivosMacro();
    }

    // Sub-motivo
    showSubMotivoModal(id = null) {
        const item = id ? dataManager.getSubMotivos().find(m => m.id === id) : null;
        const title = item ? 'Editar Sub-motivo' : 'Novo Sub-motivo';
        const motivosMacro = dataManager.getMotivosMacro();
        const options = motivosMacro.map(m => `<option value="${m.id}" ${item?.motivoMacroId === m.id ? 'selected' : ''}>${m.descricao}</option>`).join('');

        const content = `
            <form id="palitagem-form" class="form-container">
                 <input type="hidden" name="id_hidden" value="${item?.id || ''}">
                <div class="form-group">
                    <label for="id">ID:</label>
                    <input type="text" id="id" name="id" value="${item?.id || ''}" ${item ? 'readonly' : ''} required>
                </div>
                <div class="form-group">
                    <label for="motivoMacroId">Motivo Macro:</label>
                    <select id="motivoMacroId" name="motivoMacroId" required>${options}</select>
                </div>
                <div class="form-group">
                    <label for="descricao">Descrição:</label>
                    <input type="text" id="descricao" name="descricao" value="${item?.descricao || ''}" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>`;
        utils.showModal(title, content);
        document.getElementById('palitagem-form').addEventListener('submit', (e) => this.saveSubMotivo(e));
    }

    saveSubMotivo(e) {
        e.preventDefault();
        const form = e.target;
        const button = form.querySelector('button[type="submit"]');
        utils.setButtonLoading(button, true);

        const id = form.elements.id.value.trim();
        const isNew = !form.elements.id_hidden.value;
        const data = { id, descricao: form.elements.descricao.value.trim(), motivoMacroId: form.elements.motivoMacroId.value };

        const all = dataManager.getSubMotivos();
        if (isNew && all.some(item => item.id === id)) {
            utils.showMessage('Este ID já está em uso.', 'error');
            utils.setButtonLoading(button, false);
            return;
        }

        const success = dataManager.saveSubMotivos(isNew ? [...all, data] : all.map(i => i.id === id ? data : i));
        this.postSave(success, button);
    }
    
    deleteSubMotivo(id) {
         if (!confirm('Tem certeza que deseja excluir?')) return;
         const all = dataManager.getSubMotivos().filter(i => i.id !== id);
         dataManager.saveSubMotivos(all);
         this.loadSubMotivos();
    }
    
    // Motivo Micro
    showMotivoMicroModal(id = null) {
        const item = id ? dataManager.getMotivosMicro().find(m => m.id === id) : null;
        const title = item ? 'Editar Motivo Micro' : 'Novo Motivo Micro';
        const subMotivos = dataManager.getSubMotivos();
        const options = subMotivos.map(s => `<option value="${s.id}" ${item?.subMotivoId === s.id ? 'selected' : ''}>${s.descricao}</option>`).join('');

        const content = `
             <form id="palitagem-form" class="form-container">
                 <input type="hidden" name="id_hidden" value="${item?.id || ''}">
                <div class="form-group">
                    <label for="id">ID:</label>
                    <input type="text" id="id" name="id" value="${item?.id || ''}" ${item ? 'readonly' : ''} required>
                </div>
                <div class="form-group">
                    <label for="subMotivoId">Sub-motivo:</label>
                    <select id="subMotivoId" name="subMotivoId" required>${options}</select>
                </div>
                <div class="form-group">
                    <label for="descricao">Descrição:</label>
                    <input type="text" id="descricao" name="descricao" value="${item?.descricao || ''}" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>`;
        utils.showModal(title, content);
        document.getElementById('palitagem-form').addEventListener('submit', (e) => this.saveMotivoMicro(e));
    }

    saveMotivoMicro(e) {
        e.preventDefault();
        const form = e.target;
        const button = form.querySelector('button[type="submit"]');
        utils.setButtonLoading(button, true);

        const id = form.elements.id.value.trim();
        const isNew = !form.elements.id_hidden.value;
        const data = { id, descricao: form.elements.descricao.value.trim(), subMotivoId: form.elements.subMotivoId.value };

        const all = dataManager.getMotivosMicro();
        if (isNew && all.some(item => item.id === id)) {
            utils.showMessage('Este ID já está em uso.', 'error');
            utils.setButtonLoading(button, false);
            return;
        }

        const success = dataManager.saveMotivosMicro(isNew ? [...all, data] : all.map(i => i.id === id ? data : i));
        this.postSave(success, button);
    }
    
    deleteMotivoMicro(id) {
         if (!confirm('Tem certeza que deseja excluir?')) return;
         const all = dataManager.getMotivosMicro().filter(i => i.id !== id);
         dataManager.saveMotivosMicro(all);
         this.loadMotivosMicro();
    }

    // Função auxiliar pós-salvamento
    postSave(success, button) {
        if (success) {
            utils.showMessage('Item salvo com sucesso!', 'success');
            utils.hideModal();
            this.loadTabData(this.currentTab);
        } else {
            utils.showMessage('Ocorreu um erro ao salvar.', 'error');
            utils.setButtonLoading(button, false);
        }
    }
}