// Módulo de Gerenciamento de Interações
class InteracoesManager {
    constructor() {
        this.duvidasCount = 1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPalitagemOptions();
    }

    setupEventListeners() {
        // Buscar local por ID
        const buscarLocalBtn = document.getElementById('buscar-local');
        if (buscarLocalBtn) {
            buscarLocalBtn.addEventListener('click', () => this.buscarLocal());
        }

        // Enter no campo ID do local
        const localIdInput = document.getElementById('local-id');
        if (localIdInput) {
            localIdInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.buscarLocal();
                }
            });
        }

        // Adicionar nova dúvida
        const adicionarDuvidaBtn = document.getElementById('adicionar-duvida');
        if (adicionarDuvidaBtn) {
            adicionarDuvidaBtn.addEventListener('click', () => this.adicionarDuvida());
        }

        // Formulário de nova interação
        const novaInteracaoForm = document.getElementById('nova-interacao-form');
        if (novaInteracaoForm) {
            novaInteracaoForm.addEventListener('submit', (e) => this.salvarInteracao(e));
        }

        // Filtros do histórico
        const aplicarFiltrosBtn = document.getElementById('aplicar-filtros');
        if (aplicarFiltrosBtn) {
            aplicarFiltrosBtn.addEventListener('click', () => this.aplicarFiltros());
        }

        const limparFiltrosBtn = document.getElementById('limpar-filtros');
        if (limparFiltrosBtn) {
            limparFiltrosBtn.addEventListener('click', () => this.limparFiltros());
        }
    }

    loadPalitagemOptions() {
        // Carregar motivos macro
        const motivosMacro = dataManager.getMotivosMacro();
        const motivoMacroSelect = document.getElementById('motivo-macro-1');
        
        if (motivoMacroSelect) {
            motivoMacroSelect.innerHTML = '<option value="">Selecione...</option>';
            motivosMacro.forEach(motivo => {
                const option = document.createElement('option');
                option.value = motivo.id;
                option.textContent = motivo.descricao;
                motivoMacroSelect.appendChild(option);
            });

            // Configurar evento de mudança
            motivoMacroSelect.addEventListener('change', (e) => {
                this.loadSubMotivos(e.target.value, 1);
            });
        }
    }

    loadSubMotivos(motivoMacroId, duvidasIndex) {
        const subMotivos = dataManager.getSubMotivosByMacro(motivoMacroId);
        const subMotivoSelect = document.getElementById(`sub-motivo-${duvidasIndex}`);
        const motivoMicroSelect = document.getElementById(`motivo-micro-${duvidasIndex}`);
        
        if (subMotivoSelect) {
            subMotivoSelect.innerHTML = '<option value="">Selecione...</option>';
            subMotivos.forEach(subMotivo => {
                const option = document.createElement('option');
                option.value = subMotivo.id;
                option.textContent = subMotivo.descricao;
                subMotivoSelect.appendChild(option);
            });

            // Limpar motivos micro
            if (motivoMicroSelect) {
                motivoMicroSelect.innerHTML = '<option value="">Selecione...</option>';
            }

            // Configurar evento de mudança
            subMotivoSelect.addEventListener('change', (e) => {
                this.loadMotivosMicro(e.target.value, duvidasIndex);
            });
        }
    }

    loadMotivosMicro(subMotivoId, duvidasIndex) {
        const motivosMicro = dataManager.getMotivosMicroBySubMotivo(subMotivoId);
        const motivoMicroSelect = document.getElementById(`motivo-micro-${duvidasIndex}`);
        
        if (motivoMicroSelect) {
            motivoMicroSelect.innerHTML = '<option value="">Selecione...</option>';
            motivosMicro.forEach(motivoMicro => {
                const option = document.createElement('option');
                option.value = motivoMicro.id;
                option.textContent = motivoMicro.descricao;
                motivoMicroSelect.appendChild(option);
            });
        }
    }

    buscarLocal() {
        const localId = document.getElementById('local-id').value.trim();
        const localInfo = document.getElementById('local-info');
        
        if (!localId) {
            utils.showMessage('Por favor, digite o ID do local.', 'error');
            return;
        }

        const local = dataManager.getLocalById(localId);
        
        if (local) {
            // Exibir informações do local
            document.getElementById('local-nome').textContent = local.polo;
            document.getElementById('local-telefone').textContent = local.telefone1 || 'Não informado';
            document.getElementById('local-cidade').textContent = local.bairro || 'Não informado';
            document.getElementById('local-endereco').textContent = `${local.endereco}, ${local.numero}`;
            document.getElementById('local-gestor').textContent = local.gestor || 'Não informado';
            document.getElementById('local-regional').textContent = local.grupo || 'Não informado';
            
            localInfo.style.display = 'block';
            utils.showMessage('Local encontrado!');
        } else {
            localInfo.style.display = 'none';
            utils.showMessage('Local não encontrado. Verifique o ID informado.', 'error');
        }
    }

    adicionarDuvida() {
        this.duvidasCount++;
        const duvidasContainer = document.getElementById('duvidas-container');
        
        const duvidasItem = document.createElement('div');
        duvidasItem.className = 'duvida-item';
        duvidasItem.innerHTML = `
            <button type="button" class="remove-duvida" onclick="interacoesManager.removerDuvida(this)">×</button>
            <div class="form-row">
                <div class="form-group">
                    <label for="motivo-macro-${this.duvidasCount}">Motivo Macro:</label>
                    <select id="motivo-macro-${this.duvidasCount}" name="motivo-macro-${this.duvidasCount}" required>
                        <option value="">Selecione...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="sub-motivo-${this.duvidasCount}">Sub-motivo:</label>
                    <select id="sub-motivo-${this.duvidasCount}" name="sub-motivo-${this.duvidasCount}" required>
                        <option value="">Selecione...</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="motivo-micro-${this.duvidasCount}">Motivo Micro:</label>
                    <select id="motivo-micro-${this.duvidasCount}" name="motivo-micro-${this.duvidasCount}" required>
                        <option value="">Selecione...</option>
                    </select>
                </div>
            </div>
        `;
        
        duvidasContainer.appendChild(duvidasItem);
        
        // Carregar opções para a nova dúvida
        this.loadMotivosMacroForDuvida(this.duvidasCount);
    }

    loadMotivosMacroForDuvida(duvidasIndex) {
        const motivosMacro = dataManager.getMotivosMacro();
        const motivoMacroSelect = document.getElementById(`motivo-macro-${duvidasIndex}`);
        
        if (motivoMacroSelect) {
            motivoMacroSelect.innerHTML = '<option value="">Selecione...</option>';
            motivosMacro.forEach(motivo => {
                const option = document.createElement('option');
                option.value = motivo.id;
                option.textContent = motivo.descricao;
                motivoMacroSelect.appendChild(option);
            });

            // Configurar evento de mudança
            motivoMacroSelect.addEventListener('change', (e) => {
                this.loadSubMotivos(e.target.value, duvidasIndex);
            });
        }
    }

    removerDuvida(button) {
        const duvidasItem = button.parentElement;
        duvidasItem.remove();
    }

    salvarInteracao(e) {
        e.preventDefault();
        
        const localId = document.getElementById('local-id').value.trim();
        const pessoaContatada = document.getElementById('pessoa-contatada').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        
        // Validações básicas
        if (!localId || !pessoaContatada || !descricao) {
            utils.showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Verificar se o local existe
        const local = dataManager.getLocalById(localId);
        if (!local) {
            utils.showMessage('Local não encontrado. Por favor, busque um local válido.', 'error');
            return;
        }

        // Coletar dúvidas
        const duvidas = [];
        const duvidasItems = document.querySelectorAll('.duvida-item');
        
        for (let i = 0; i < duvidasItems.length; i++) {
            const item = duvidasItems[i];
            const motivoMacroSelect = item.querySelector('[id^="motivo-macro-"]');
            const subMotivoSelect = item.querySelector('[id^="sub-motivo-"]');
            const motivoMicroSelect = item.querySelector('[id^="motivo-micro-"]');
            
            if (motivoMacroSelect && subMotivoSelect && motivoMicroSelect) {
                const motivoMacro = motivoMacroSelect.value;
                const subMotivo = subMotivoSelect.value;
                const motivoMicro = motivoMicroSelect.value;
                
                if (!motivoMacro || !subMotivo || !motivoMicro) {
                    utils.showMessage('Por favor, preencha todos os níveis de palitagem para todas as dúvidas.', 'error');
                    return;
                }
                
                // Buscar descrições
                const motivosMacro = dataManager.getMotivosMacro();
                const subMotivos = dataManager.getSubMotivos();
                const motivosMicro = dataManager.getMotivosMicro();
                
                const motivoMacroObj = motivosMacro.find(m => m.id === motivoMacro);
                const subMotivoObj = subMotivos.find(s => s.id === subMotivo);
                const motivoMicroObj = motivosMicro.find(m => m.id === motivoMicro);
                
                duvidas.push({
                    motivoMacro: {
                        id: motivoMacro,
                        descricao: motivoMacroObj ? motivoMacroObj.descricao : ''
                    },
                    subMotivo: {
                        id: subMotivo,
                        descricao: subMotivoObj ? subMotivoObj.descricao : ''
                    },
                    motivoMicro: {
                        id: motivoMicro,
                        descricao: motivoMicroObj ? motivoMicroObj.descricao : ''
                    }
                });
            }
        }

        if (duvidas.length === 0) {
            utils.showMessage('Por favor, adicione pelo menos uma dúvida.', 'error');
            return;
        }

        // Criar objeto da interação
        const interacaoData = {
            localId: localId,
            local: local,
            pessoaContatada: pessoaContatada,
            descricao: descricao,
            duvidas: duvidas
        };

        try {
            dataManager.saveInteracao(interacaoData);
            utils.showMessage('Interação registrada com sucesso!');
            this.limparFormulario();
            
            // Atualizar dashboard se estiver visível
            if (typeof updateDashboardCards === 'function') {
                updateDashboardCards();
            }
        } catch (error) {
            utils.showMessage('Erro ao salvar interação: ' + error.message, 'error');
        }
    }

    limparFormulario() {
        document.getElementById('nova-interacao-form').reset();
        document.getElementById('local-info').style.display = 'none';
        
        // Remover dúvidas extras
        const duvidasContainer = document.getElementById('duvidas-container');
        const duvidasItems = duvidasContainer.querySelectorAll('.duvida-item');
        
        for (let i = 1; i < duvidasItems.length; i++) {
            duvidasItems[i].remove();
        }
        
        this.duvidasCount = 1;
        
        // Limpar selects da primeira dúvida
        document.getElementById('sub-motivo-1').innerHTML = '<option value="">Selecione...</option>';
        document.getElementById('motivo-micro-1').innerHTML = '<option value="">Selecione...</option>';
    }

    loadHistorico() {
        const currentUser = authSystem.getCurrentUser();
        let interacoes;
        
        if (currentUser.role === 'admin') {
            interacoes = dataManager.getInteracoes();
        } else {
            interacoes = dataManager.getInteracoesByUser(currentUser.id);
        }
        
        this.renderHistoricoTable(interacoes);
    }

    renderHistoricoTable(interacoes) {
        const tbody = document.querySelector('#historico-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        interacoes.forEach(interacao => {
            const row = document.createElement('tr');
            
            // Formatar motivos
            const motivosText = interacao.duvidas.map(d => 
                `${d.motivoMacro.descricao} > ${d.subMotivo.descricao} > ${d.motivoMicro.descricao}`
            ).join('; ');
            
            row.innerHTML = `
                <td>${utils.formatDate(interacao.dataHora)}</td>
                <td>${interacao.local.polo} (${interacao.localId})</td>
                <td>${interacao.pessoaContatada}</td>
                <td>${interacao.descricao}</td>
                <td title="${motivosText}">${motivosText.length > 50 ? motivosText.substring(0, 50) + '...' : motivosText}</td>
                <td>
                    <button class="btn btn-secondary" onclick="interacoesManager.visualizarInteracao('${interacao.id}')">Ver Detalhes</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    visualizarInteracao(interacaoId) {
        const interacoes = dataManager.getInteracoes();
        const interacao = interacoes.find(i => i.id === interacaoId);
        
        if (!interacao) {
            utils.showMessage('Interação não encontrada.', 'error');
            return;
        }

        const motivosHtml = interacao.duvidas.map((d, index) => `
            <div class="duvida-detalhes">
                <h4>Dúvida ${index + 1}:</h4>
                <p><strong>Motivo Macro:</strong> ${d.motivoMacro.descricao}</p>
                <p><strong>Sub-motivo:</strong> ${d.subMotivo.descricao}</p>
                <p><strong>Motivo Micro:</strong> ${d.motivoMicro.descricao}</p>
            </div>
        `).join('');

        const content = `
            <div class="interacao-detalhes">
                <div class="info-section">
                    <h3>Informações Gerais</h3>
                    <p><strong>Data/Hora:</strong> ${utils.formatDate(interacao.dataHora)}</p>
                    <p><strong>Usuário:</strong> ${interacao.usuario}</p>
                    <p><strong>Local:</strong> ${interacao.local.polo} (ID: ${interacao.localId})</p>
                    <p><strong>Pessoa Contatada:</strong> ${interacao.pessoaContatada}</p>
                    <p><strong>Descrição:</strong> ${interacao.descricao}</p>
                </div>
                
                <div class="motivos-section">
                    <h3>Motivos/Dúvidas</h3>
                    ${motivosHtml}
                </div>
            </div>
        `;

        utils.showModal('Detalhes da Interação', content);
    }

    aplicarFiltros() {
        const dataInicio = document.getElementById('filtro-data-inicio').value;
        const dataFim = document.getElementById('filtro-data-fim').value;
        const localFiltro = document.getElementById('filtro-local').value.toLowerCase();
        
        const currentUser = authSystem.getCurrentUser();
        let interacoes;
        
        if (currentUser.role === 'admin') {
            interacoes = dataManager.getInteracoes();
        } else {
            interacoes = dataManager.getInteracoesByUser(currentUser.id);
        }
        
        // Aplicar filtros
        let interacoesFiltradas = interacoes.filter(interacao => {
            let incluir = true;
            
            // Filtro por data
            if (dataInicio) {
                const dataInteracao = new Date(interacao.dataHora).toDateString();
                const dataInicioObj = new Date(dataInicio).toDateString();
                if (dataInteracao < dataInicioObj) {
                    incluir = false;
                }
            }
            
            if (dataFim) {
                const dataInteracao = new Date(interacao.dataHora).toDateString();
                const dataFimObj = new Date(dataFim).toDateString();
                if (dataInteracao > dataFimObj) {
                    incluir = false;
                }
            }
            
            // Filtro por local
            if (localFiltro) {
                const localTexto = `${interacao.localId} ${interacao.local.polo}`.toLowerCase();
                if (!localTexto.includes(localFiltro)) {
                    incluir = false;
                }
            }
            
            return incluir;
        });
        
        this.renderHistoricoTable(interacoesFiltradas);
        utils.showMessage(`${interacoesFiltradas.length} interação(ões) encontrada(s).`);
    }

    limparFiltros() {
        document.getElementById('filtro-data-inicio').value = '';
        document.getElementById('filtro-data-fim').value = '';
        document.getElementById('filtro-local').value = '';
        this.loadHistorico();
    }
}