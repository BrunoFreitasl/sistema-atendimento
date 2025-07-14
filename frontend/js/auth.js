// Sistema de Autenticação com Hash de Senhas
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.DB_NAME = 'users';
    }

    async init() {
        // Verificar se há usuário logado
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }

        // Criar usuários padrão se não existirem
        await this.createDefaultUsers();
    }

    // --- Funções de Hash ---
    async hashPassword(password) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        } catch (error) {
            console.error('Erro ao gerar hash da senha:', error);
            throw new Error('Não foi possível processar a senha.');
        }
    }

    // --- Gerenciamento de Usuários ---
    getUsers() {
        const users = localStorage.getItem(this.DB_NAME);
        return users ? JSON.parse(users) : [];
    }

    saveUsers(users) {
        localStorage.setItem(this.DB_NAME, JSON.stringify(users));
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    async createDefaultUsers() {
        const users = this.getUsers();
        
        // Criar admin padrão se não existir
        if (!users.find(user => user.username === 'admin')) {
            const hashedPassword = await this.hashPassword('admin123');
            const adminUser = {
                id: this.generateId(),
                name: 'Administrador',
                username: 'admin',
                passwordHash: hashedPassword,
                role: 'admin',
                createdAt: new Date().toISOString(),
                active: true
            };
            users.push(adminUser);
        }

        // Criar usuário de teste se não existir
        if (!users.find(user => user.username === 'atendente')) {
            const hashedPassword = await this.hashPassword('123456');
            const atendenteUser = {
                id: this.generateId(),
                name: 'Atendente Teste',
                username: 'atendente',
                passwordHash: hashedPassword,
                role: 'atendente',
                createdAt: new Date().toISOString(),
                active: true
            };
            users.push(atendenteUser);
        }
        
        this.saveUsers(users);
    }

    async login(username, password) {
        await this.init(); // Garante que os usuários padrão existam
        const users = this.getUsers();
        const passwordHash = await this.hashPassword(password);
        
        const user = users.find(u => 
            u.username === username && 
            u.passwordHash === passwordHash && 
            u.active
        );

        if (user) {
            this.currentUser = {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            return { success: true, user: this.currentUser };
        }

        return { success: false, message: 'Usuário ou senha inválidos' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    isLoggedIn() {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser !== null;
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            }
        }
        return this.currentUser;
    }

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    async createUser(userData) {
        if (!this.isAdmin()) {
            return { success: false, message: 'Apenas administradores podem criar usuários' };
        }

        const users = this.getUsers();
        
        if (users.find(u => u.username === userData.username)) {
            return { success: false, message: 'Nome de usuário já existe' };
        }

        const hashedPassword = await this.hashPassword(userData.password);
        const newUser = {
            id: this.generateId(),
            name: userData.name,
            username: userData.username,
            passwordHash: hashedPassword,
            role: userData.role,
            createdAt: new Date().toISOString(),
            active: true
        };

        users.push(newUser);
        this.saveUsers(users);

        return { success: true, user: newUser };
    }

    async updateUser(userId, userData) {
        if (!this.isAdmin()) {
            return { success: false, message: 'Apenas administradores podem editar usuários' };
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return { success: false, message: 'Usuário não encontrado' };
        }

        // Atualiza os dados
        users[userIndex] = { ...users[userIndex], ...userData };
        
        // Se a senha foi alterada, gera novo hash
        if (userData.password) {
            users[userIndex].passwordHash = await this.hashPassword(userData.password);
            delete users[userIndex].password; // Remove a senha em texto plano
        }

        this.saveUsers(users);
        return { success: true, user: users[userIndex] };
    }

    deleteUser(userId) {
        if (!this.isAdmin()) {
            return { success: false, message: 'Apenas administradores podem excluir usuários' };
        }
        
        const currentUser = this.getCurrentUser();
        if (userId === currentUser.id) {
            return { success: false, message: 'Não é possível excluir o próprio usuário' };
        }

        let users = this.getUsers();
        users = users.filter(u => u.id !== userId);
        this.saveUsers(users);

        return { success: true };
    }
}

// Instância global do sistema de autenticação
window.authSystem = new AuthSystem();