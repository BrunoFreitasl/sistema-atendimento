// Script da página de login
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já está logado
    if (authSystem.isLoggedIn()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('login-error');
    const loginButton = loginForm.querySelector('button[type="submit"]');

    // Focar no campo de usuário
    if(usernameInput) usernameInput.focus();

    // Manipular envio do formulário
    if(loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            // Validações básicas
            if (!username || !password) {
                showError('Por favor, preencha todos os campos.');
                return;
            }

            // Desabilitar botão para evitar cliques duplos
            loginButton.disabled = true;
            loginButton.textContent = 'Entrando...';

            // Tentar fazer login
            const result = await authSystem.login(username, password);
            
            if (result.success) {
                // Login bem-sucedido
                hideError();
                window.location.href = 'dashboard.html';
            } else {
                // Erro no login
                showError(result.message);
                passwordInput.value = '';
                passwordInput.focus();
                // Reabilitar botão
                loginButton.disabled = false;
                loginButton.textContent = 'Entrar';
            }
        });
    }

    function showError(message) {
        if(errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    function hideError() {
        if(errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
});