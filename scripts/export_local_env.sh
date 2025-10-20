#!/bin/bash

# Exporta e exibe variáveis do .env
grep -v '^#' .env | grep '=' | while read line; do
  echo "Exportando: $line"
  export $line
done