// Script principal do dashboard

// --- UTILS GLOBAIS ---
window.utils = {
    formatDate: (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
    },

    showModal: (title, content) => {
        const modal = document.getElementById('modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = title;
            modalBody.innerHTML = content;
            modal.style.display = 'flex';
        }
    },

    hideModal: () => {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.style.display = 'none';
            const modalBody = document.getElementById('modal-body');
            if(modalBody) modalBody.innerHTML = '';
        }
    },

    showMessage: (message, type = 'success') => {
        const container = document.createElement('div');
        container.className = `message-toast ${type}`;
        container.textContent = message;
        document.body.appendChild(container);
        setTimeout(() => {
            container.style.opacity = '0';
            container.addEventListener('transitionend', () => container.remove());
        }, 4000);
    },
    
    setButtonLoading: (button, isLoading, loadingText = 'Salvando...') => {
        if (!button) return;
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = `<span class="spinner"></span> ${loadingText}`;
        } else {
            button.disabled = false;
            if (button.dataset.originalText) {
                button.innerHTML = button.dataset.originalText;
            }
        }
    }
};


// --- INICIALIZAÇÃO DO SISTEMA ---
class SystemInitializer {
    static async init() {
        console.log('Iniciando sistema...');

        try {
            // 1. Verificação de Autenticação
            if (!authSystem.requireAuth()) return;

            // 2. Criação centralizada dos managers
            this.createManagers();

            // 3. Inicialização da interface
            this.initializeInterface();

            console.log('Sistema inicializado com sucesso.');
            
        } catch (error) {
            console.error('Erro fatal na inicialização:', error);
            utils.showMessage('Erro crítico ao iniciar o sistema. Verifique o console.', 'error');
        }
    }

    static createManagers() {
        console.log('Criando managers...');
        // O dataManager deve ser o primeiro
        if (typeof DataManager !== 'undefined') {
            window.dataManager = new DataManager();
        } else {
            throw new Error('Classe DataManager não encontrada.');
        }

        // Os outros managers que agora só têm a definição da classe
        window.interacoesManager = new InteracoesManager();
        window.locaisManager = new LocaisManager();
        window.colaboradoresManager = new ColaboradoresManager();
        window.palitagemManager = new PalitagemManager();
        window.relatoriosManager = new RelatoriosManager();
        window.configuracoesManager = new ConfiguracoesManager();
        console.log('Managers criados.');
    }

    static initializeInterface() {
        console.log('Inicializando interface...');
        const currentUser = authSystem.getCurrentUser();
        
        if (!currentUser) {
            authSystem.logout();
            return;
        }

        document.getElementById('user-name').textContent = currentUser.name;
        document.body.setAttribute('data-user-role', currentUser.role);
        
        themeSystem.init(); 
        this.loadWelcomeMessages();

        this.setupNavigation();
        this.setupModals();
        this.setupLogout();
        
        showSection('dashboard');
        console.log('Interface inicializada.');
    }

    static loadWelcomeMessages() {
        const config = window.dataManager.getConfiguracoes();
        document.getElementById('welcome-title').textContent = config.welcomeTitle;
        document.getElementById('welcome-text').textContent = config.welcomeText;
    }

    static setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionName = e.currentTarget.dataset.section;
                if (sectionName) showSection(sectionName);
            });
        });
    }

    static setupModals() {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
                    utils.hideModal();
                }
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') utils.hideModal();
        });
    }

    static setupLogout() {
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja sair?')) authSystem.logout();
        });
    }
}

// --- CONTROLE DE SEÇÕES ---
// A função showSection corrigida
function showSection(sectionName) {
    // 1. Esconde TODAS as seções e remove a classe ativa de todos os links
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none'; // Define o display como 'none' explicitamente
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // 2. Encontra e mostra a seção e o link alvo
    const targetSection = document.getElementById(`${sectionName}-section`);
    const targetLink = document.querySelector(`.nav-link[data-section="${sectionName}"]`);

    if (targetSection) {
        targetSection.style.display = 'block'; // Define o display como 'block' explicitamente
        targetSection.classList.add('active');
    }
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // 3. Carrega os dados da seção que acabou de ser exibida
    loadSectionData(sectionName);
}

function loadSectionData(sectionName) {
    console.log(`Carregando dados para: ${sectionName}`);
    try {
        switch (sectionName) {
            case 'dashboard':
                updateDashboardCards();
                break;
            case 'locais':
                window.locaisManager?.loadLocais();
                break;
            case 'colaboradores':
                window.colaboradoresManager?.loadColaboradores();
                break;
            case 'palitagem':
                window.palitagemManager?.loadTabData(palitagemManager.currentTab);
                break;
            case 'historico':
                 window.interacoesManager?.loadHistorico();
                 break;
        }
    } catch (error) {
        console.error(`Erro ao carregar dados da seção ${sectionName}:`, error);
        utils.showMessage(`Não foi possível carregar os dados de ${sectionName}.`, 'error');
    }
}

function updateDashboardCards() {
    if (!window.dataManager) return;
    const currentUser = authSystem.getCurrentUser();
    const interacoes = dataManager.getInteracoes();
    
    const hoje = new Date().toDateString();
    const interacoesHoje = interacoes.filter(i => 
        new Date(i.dataHora).toDateString() === hoje && 
        (authSystem.isAdmin() || i.usuarioId === currentUser.id)
    ).length;
    document.getElementById('interacoes-hoje').textContent = interacoesHoje;

    const totalInteracoes = authSystem.isAdmin() 
        ? interacoes.length 
        : interacoes.filter(i => i.usuarioId === currentUser.id).length;
    document.getElementById('total-interacoes').textContent = totalInteracoes;

    if (authSystem.isAdmin()) {
        document.getElementById('total-locais').textContent = dataManager.getLocais().length;
        document.getElementById('total-colaboradores').textContent = authSystem.getUsers().length;
    }
}

// --- PONTO DE ENTRADA ---
document.addEventListener('DOMContentLoaded', () => {
    // Usamos uma função de seta para garantir o contexto correto do 'this' dentro de SystemInitializer
    setTimeout(() => SystemInitializer.init(), 0);
});