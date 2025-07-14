#!/bin/bash

# Script de instalação do Sistema de Registro de Interações de Atendimento

echo "Iniciando a instalação do Sistema de Registro de Interações de Atendimento..."

# Verifica se o diretório de destino existe, se não, cria
if [ ! -d "./sistema-atendimento" ]; then
    echo "Criando diretório de instalação: sistema-atendimento"
    mkdir -p sistema-atendimento
fi

echo "Copiando arquivos do sistema..."

# Copia os arquivos para o diretório de instalação
cp -r ./* ./sistema-atendimento/

echo "Instalação concluída!"
echo "Para iniciar o sistema, abra o arquivo index.html no seu navegador web."


