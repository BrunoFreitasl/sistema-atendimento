// Módulo de Relatórios
class RelatoriosManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadColaboradoresOptions();
    }

    setupEventListeners() {
        // Gerar relatório
        const gerarRelatorioBtn = document.getElementById('gerar-relatorio');
        if (gerarRelatorioBtn) {
            gerarRelatorioBtn.addEventListener('click', () => this.gerarRelatorio());
        }

        // Exportar CSV
        const exportarCsvBtn = document.getElementById('exportar-csv');
        if (exportarCsvBtn) {
            exportarCsvBtn.addEventListener('click', () => this.exportarCSV());
        }

        // Exportar XML
        const exportarXmlBtn = document.getElementById('exportar-xml');
        if (exportarXmlBtn) {
            exportarXmlBtn.addEventListener('click', () => this.exportarXML());
        }
    }

    loadColaboradoresOptions() {
        const users = authSystem.getUsers();
        const colaboradorSelect = document.getElementById('relatorio-colaborador');
        
        if (colaboradorSelect) {
            colaboradorSelect.innerHTML = '<option value="">Todos</option>';
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.name;
                colaboradorSelect.appendChild(option);
            });
        }
    }

    gerarRelatorio() {
        const dataInicio = document.getElementById('relatorio-data-inicio').value;
        const dataFim = document.getElementById('relatorio-data-fim').value;
        const colaboradorId = document.getElementById('relatorio-colaborador').value;
        
        let interacoes = dataManager.getInteracoes();
        
        // Aplicar filtros
        interacoes = this.aplicarFiltrosRelatorio(interacoes, dataInicio, dataFim, colaboradorId);
        
        // Renderizar tabela
        this.renderRelatorioTable(interacoes);
        
        utils.showMessage(`Relatório gerado com ${interacoes.length} interação(ões).`);
    }

    aplicarFiltrosRelatorio(interacoes, dataInicio, dataFim, colaboradorId) {
        return interacoes.filter(interacao => {
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
            
            // Filtro por colaborador
            if (colaboradorId && interacao.usuarioId !== colaboradorId) {
                incluir = false;
            }
            
            return incluir;
        });
    }

    renderRelatorioTable(interacoes) {
        const tbody = document.querySelector('#relatorio-table tbody');
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
                <td>${interacao.usuario}</td>
                <td>${interacao.local.polo} (${interacao.localId})</td>
                <td>${interacao.pessoaContatada}</td>
                <td title="${interacao.descricao}">${interacao.descricao.length > 50 ? interacao.descricao.substring(0, 50) + '...' : interacao.descricao}</td>
                <td title="${motivosText}">${motivosText.length > 50 ? motivosText.substring(0, 50) + '...' : motivosText}</td>
            `;
            tbody.appendChild(row);
        });
    }

    exportarCSV() {
        const interacoes = this.getFilteredInteracoes();
        
        if (interacoes.length === 0) {
            utils.showMessage('Não há dados para exportar. Gere um relatório primeiro.', 'error');
            return;
        }

        // Preparar dados para exportação
        const exportData = this.prepareExportData(interacoes);
        
        const filename = `relatorio_interacoes_${new Date().toISOString().split('T')[0]}.csv`;
        dataManager.exportToCSV(exportData, filename);
        utils.showMessage('Relatório exportado em CSV com sucesso!');
    }

    exportarXML() {
        const interacoes = this.getFilteredInteracoes();
        
        if (interacoes.length === 0) {
            utils.showMessage('Não há dados para exportar. Gere um relatório primeiro.', 'error');
            return;
        }

        // Preparar dados para exportação
        const exportData = this.prepareExportData(interacoes);
        
        const filename = `relatorio_interacoes_${new Date().toISOString().split('T')[0]}.xml`;
        dataManager.exportToXML(exportData, filename, 'relatorio_interacoes');
        utils.showMessage('Relatório exportado em XML com sucesso!');
    }

    getFilteredInteracoes() {
        const dataInicio = document.getElementById('relatorio-data-inicio').value;
        const dataFim = document.getElementById('relatorio-data-fim').value;
        const colaboradorId = document.getElementById('relatorio-colaborador').value;
        
        let interacoes = dataManager.getInteracoes();
        return this.aplicarFiltrosRelatorio(interacoes, dataInicio, dataFim, colaboradorId);
    }

    prepareExportData(interacoes) {
        return interacoes.map(interacao => {
            // Formatar motivos para exportação
            const motivosDetalhados = interacao.duvidas.map((d, index) => ({
                [`duvida_${index + 1}_motivo_macro`]: d.motivoMacro.descricao,
                [`duvida_${index + 1}_sub_motivo`]: d.subMotivo.descricao,
                [`duvida_${index + 1}_motivo_micro`]: d.motivoMicro.descricao
            }));

            // Combinar todos os motivos em um objeto
            const motivosObj = {};
            motivosDetalhados.forEach(motivo => {
                Object.assign(motivosObj, motivo);
            });

            return {
                id: interacao.id,
                data_hora: utils.formatDate(interacao.dataHora),
                colaborador: interacao.usuario,
                local_id: interacao.localId,
                local_nome: interacao.local.polo,
                local_gestor: interacao.local.gestor,
                local_grupo: interacao.local.grupo,
                local_endereco: `${interacao.local.endereco}, ${interacao.local.numero}`,
                local_telefone: interacao.local.telefone1,
                local_email: interacao.local.email,
                pessoa_contatada: interacao.pessoaContatada,
                descricao: interacao.descricao,
                total_duvidas: interacao.duvidas.length,
                ...motivosObj
            };
        });
    }

    gerarRelatorioEstatisticas() {
        const interacoes = dataManager.getInteracoes();
        const locais = dataManager.getLocais();
        const users = authSystem.getUsers();
        
        // Estatísticas gerais
        const estatisticas = {
            totalInteracoes: interacoes.length,
            totalLocais: locais.length,
            totalColaboradores: users.length,
            interacoesHoje: this.getInteracoesHoje(interacoes),
            interacoesSemana: this.getInteracoesSemana(interacoes),
            interacoesMes: this.getInteracoesMes(interacoes)
        };

        // Top motivos macro
        const motivosMacroCount = {};
        interacoes.forEach(interacao => {
            interacao.duvidas.forEach(duvida => {
                const motivo = duvida.motivoMacro.descricao;
                motivosMacroCount[motivo] = (motivosMacroCount[motivo] || 0) + 1;
            });
        });

        const topMotivosMacro = Object.entries(motivosMacroCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        // Top colaboradores
        const colaboradoresCount = {};
        interacoes.forEach(interacao => {
            const colaborador = interacao.usuario;
            colaboradoresCount[colaborador] = (colaboradoresCount[colaborador] || 0) + 1;
        });

        const topColaboradores = Object.entries(colaboradoresCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        // Top locais
        const locaisCount = {};
        interacoes.forEach(interacao => {
            const local = interacao.local.polo;
            locaisCount[local] = (locaisCount[local] || 0) + 1;
        });

        const topLocais = Object.entries(locaisCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        return {
            estatisticas,
            topMotivosMacro,
            topColaboradores,
            topLocais
        };
    }

    getInteracoesHoje(interacoes) {
        const hoje = new Date().toDateString();
        return interacoes.filter(i => {
            const dataInteracao = new Date(i.dataHora).toDateString();
            return dataInteracao === hoje;
        }).length;
    }

    getInteracoesSemana(interacoes) {
        const agora = new Date();
        const semanaAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        return interacoes.filter(i => {
            const dataInteracao = new Date(i.dataHora);
            return dataInteracao >= semanaAtras && dataInteracao <= agora;
        }).length;
    }

    getInteracoesMes(interacoes) {
        const agora = new Date();
        const mesAtras = new Date(agora.getFullYear(), agora.getMonth() - 1, agora.getDate());
        
        return interacoes.filter(i => {
            const dataInteracao = new Date(i.dataHora);
            return dataInteracao >= mesAtras && dataInteracao <= agora;
        }).length;
    }

    showEstatisticasModal() {
        const dados = this.gerarRelatorioEstatisticas();
        
        const topMotivosHtml = dados.topMotivosMacro.map(([motivo, count]) => 
            `<li>${motivo}: ${count} interações</li>`
        ).join('');

        const topColaboradoresHtml = dados.topColaboradores.map(([colaborador, count]) => 
            `<li>${colaborador}: ${count} interações</li>`
        ).join('');

        const topLocaisHtml = dados.topLocais.map(([local, count]) => 
            `<li>${local}: ${count} interações</li>`
        ).join('');

        const content = `
            <div class="estatisticas-container">
                <div class="estatisticas-section">
                    <h3>Estatísticas Gerais</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <strong>Total de Interações:</strong> ${dados.estatisticas.totalInteracoes}
                        </div>
                        <div class="stat-item">
                            <strong>Interações Hoje:</strong> ${dados.estatisticas.interacoesHoje}
                        </div>
                        <div class="stat-item">
                            <strong>Interações (7 dias):</strong> ${dados.estatisticas.interacoesSemana}
                        </div>
                        <div class="stat-item">
                            <strong>Interações (30 dias):</strong> ${dados.estatisticas.interacoesMes}
                        </div>
                        <div class="stat-item">
                            <strong>Total de Locais:</strong> ${dados.estatisticas.totalLocais}
                        </div>
                        <div class="stat-item">
                            <strong>Total de Colaboradores:</strong> ${dados.estatisticas.totalColaboradores}
                        </div>
                    </div>
                </div>
                
                <div class="estatisticas-section">
                    <h3>Top 5 Motivos Macro</h3>
                    <ul>${topMotivosHtml}</ul>
                </div>
                
                <div class="estatisticas-section">
                    <h3>Top 5 Colaboradores</h3>
                    <ul>${topColaboradoresHtml}</ul>
                </div>
                
                <div class="estatisticas-section">
                    <h3>Top 5 Locais</h3>
                    <ul>${topLocaisHtml}</ul>
                </div>
            </div>
        `;

        utils.showModal('Estatísticas do Sistema', content);
    }
}