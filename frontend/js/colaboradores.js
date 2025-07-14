// Módulo de Gerenciamento de Colaboradores
class ColaboradoresManager {
    constructor() {
        this.currentColaborador = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const novoColaboradorBtn = document.getElementById('novo-colaborador');
        if (novoColaboradorBtn) {
            novoColaboradorBtn.addEventListener('click', () => this.showColaboradorModal());
        }
    }

    loadColaboradores() {
        const users = authSystem.getUsers();
        const tbody = document.querySelector('#colaboradores-table tbody');
        
        if (!tbody) return;
        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.username}</td>
                <td>${user.role === 'admin' ? 'Administrador' : 'Atendente'}</td>
                <td>${new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>
                    <button class="btn btn-secondary" onclick="colaboradoresManager.editColaborador('${user.id}')">Editar</button>
                    <button class="btn btn-warning" onclick="colaboradoresManager.showChangePasswordModal('${user.id}')">Alterar Senha</button>
                    <button class="btn btn-error" onclick="colaboradoresManager.deleteColaborador('${user.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    showColaboradorModal(userId = null) {
        const users = authSystem.getUsers();
        this.currentColaborador = userId ? users.find(u => u.id === userId) : null;
        
        const title = this.currentColaborador ? 'Editar Colaborador' : 'Novo Colaborador';
        const content = this.getColaboradorModalContent();
        
        utils.showModal(title, content);
        
        const form = document.getElementById('colaborador-form');
        if (form) {
            form.addEventListener('submit', (e) => this.saveColaborador(e));
        }
    }

    getColaboradorModalContent() {
        const col = this.currentColaborador || {};
        const isNew = !this.currentColaborador;

        return `
            <form id="colaborador-form" class="form-container">
                <input type="hidden" id="colaborador-id" value="${col.id || ''}">
                <div class="form-group">
                    <label for="colaborador-nome">Nome Completo:</label>
                    <input type="text" id="colaborador-nome" value="${col.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="colaborador-username">Nome de Usuário:</label>
                    <input type="text" id="colaborador-username" value="${col.username || ''}" ${!isNew ? 'readonly' : ''} required>
                </div>
                <div class="form-group">
                    <label for="colaborador-role">Nível de Acesso:</label>
                    <select id="colaborador-role" required>
                        <option value="atendente" ${col.role === 'atendente' ? 'selected' : ''}>Atendente</option>
                        <option value="admin" ${col.role === 'admin' ? 'selected' : ''}>Administrador</option>
                    </select>
                </div>
                ${isNew ? `
                <div class="form-group">
                    <label for="colaborador-password">Senha (mín. 6 caracteres):</label>
                    <input type="password" id="colaborador-password" required>
                </div>
                <div class="form-group">
                    <label for="colaborador-password-confirm">Confirmar Senha:</label>
                    <input type="password" id="colaborador-password-confirm" required>
                </div>
                ` : ''}
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Salvar</button>
                    <button type="button" class="btn btn-secondary" onclick="utils.hideModal()">Cancelar</button>
                </div>
            </form>
        `;
    }

    async saveColaborador(e) {
        e.preventDefault();
        const form = e.target;
        const saveButton = form.querySelector('button[type="submit"]');
        
        utils.setButtonLoading(saveButton, true);

        const id = document.getElementById('colaborador-id').value;
        const isNew = !id;

        const userData = {
            name: document.getElementById('colaborador-nome').value,
            username: document.getElementById('colaborador-username').value,
            role: document.getElementById('colaborador-role').value,
            active: true
        };

        if (isNew) {
            const password = document.getElementById('colaborador-password').value;
            const confirm = document.getElementById('colaborador-password-confirm').value;
            if (password.length < 6) {
                utils.showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
                utils.setButtonLoading(saveButton, false);
                return;
            }
            if (password !== confirm) {
                utils.showMessage('As senhas não coincidem.', 'error');
                utils.setButtonLoading(saveButton, false);
                return;
            }
            userData.password = password;
        }

        const result = isNew ? await authSystem.createUser(userData) : await authSystem.updateUser(id, userData);

        if (result.success) {
            utils.showMessage(`Colaborador ${isNew ? 'cadastrado' : 'atualizado'} com sucesso!`);
            utils.hideModal();
            this.loadColaboradores();
        } else {
            utils.showMessage(result.message, 'error');
        }
        
        utils.setButtonLoading(saveButton, false);
    }
    
    deleteColaborador(userId) {
        if (!confirm('Tem certeza que deseja excluir este colaborador?')) return;

        const result = authSystem.deleteUser(userId);
        if (result.success) {
            utils.showMessage('Colaborador excluído com sucesso!');
            this.loadColaboradores();
        } else {
            utils.showMessage(result.message, 'error');
        }
    }
    
    showChangePasswordModal(userId) {
        const user = authSystem.getUsers().find(u => u.id === userId);
        if (!user) {
            utils.showMessage('Usuário não encontrado.', 'error');
            return;
        }

        const title = `Alterar Senha de ${user.name}`;
        const content = `
            <form id="change-password-form" class="form-container">
                <input type="hidden" id="change-password-user-id" value="${userId}">
                <div class="form-group">
                    <label for="new-password">Nova Senha (mín. 6 caracteres):</label>
                    <input type="password" id="new-password" required>
                </div>
                <div class="form-group">
                    <label for="new-password-confirm">Confirmar Nova Senha:</label>
                    <input type="password" id="new-password-confirm" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Alterar Senha</button>
                    <button type="button" class="btn btn-secondary" onclick="utils.hideModal()">Cancelar</button>
                </div>
            </form>
        `;

        utils.showModal(title, content);

        const form = document.getElementById('change-password-form');
        if (form) {
            form.addEventListener('submit', (e) => this.changePassword(e));
        }
    }

    async changePassword(e) {
        e.preventDefault();
        const form = e.target;
        const saveButton = form.querySelector('button[type="submit"]');
        utils.setButtonLoading(saveButton, true);

        const userId = document.getElementById('change-password-user-id').value;
        const newPassword = document.getElementById('new-password').value;
        const confirm = document.getElementById('new-password-confirm').value;

        if (newPassword.length < 6) {
            utils.showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
            utils.setButtonLoading(saveButton, false);
            return;
        }
        if (newPassword !== confirm) {
            utils.showMessage('As senhas não coincidem.', 'error');
            utils.setButtonLoading(saveButton, false);
            return;
        }

        const result = await authSystem.updateUser(userId, { password: newPassword });

        if (result.success) {
            utils.showMessage('Senha alterada com sucesso!');
            utils.hideModal();
        } else {
            utils.showMessage(result.message, 'error');
        }

        utils.setButtonLoading(saveButton, false);
    }

    editColaborador(userId) {
        this.showColaboradorModal(userId);
    }
}