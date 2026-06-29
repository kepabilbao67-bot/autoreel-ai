#!/bin/bash
# Script de configuracion inicial para AutoReel AI
# Uso: bash scripts/setup.sh

set -e

echo "🎬 AutoReel AI - Configuracion Inicial"
echo "========================================"
echo ""

# Verificar version de Node.js
echo "📋 Verificando Node.js..."
if ! command -v node &> /dev/null; then
  echo "❌ Node.js no esta instalado. Se requiere v18 o superior."
  echo "   Instala desde: https://nodejs.org"
  exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Se requiere Node.js v18 o superior. Version actual: $(node -v)"
  exit 1
fi
echo "✅ Node.js $(node -v) detectado"

# Verificar npm
echo ""
echo "📋 Verificando npm..."
if ! command -v npm &> /dev/null; then
  echo "❌ npm no esta instalado."
  exit 1
fi
echo "✅ npm $(npm -v) detectado"

# Copiar .env.example a .env.local si no existe
echo ""
echo "📋 Configurando variables de entorno..."
if [ ! -f .env.local ]; then
  if [ -f .env.example ]; then
    cp .env.example .env.local
    echo "✅ .env.local creado desde .env.example"
    echo "   ⚠️  Recuerda configurar tus variables de entorno en .env.local"
  else
    echo "⚠️  No se encontro .env.example. Crea .env.local manualmente."
  fi
else
  echo "✅ .env.local ya existe"
fi

# Instalar dependencias
echo ""
echo "📋 Instalando dependencias..."
npm install
echo "✅ Dependencias instaladas"

# Mensaje de exito
echo ""
echo "========================================"
echo "🎉 Configuracion completada exitosamente!"
echo ""
echo "Proximos pasos:"
echo "  1. Configura tus variables en .env.local"
echo "  2. Ejecuta: npm run dev"
echo "  3. Abre: http://localhost:3000"
echo ""
echo "Comandos utiles:"
echo "  npm run dev    - Servidor de desarrollo"
echo "  npm run build  - Build de produccion"
echo "  npm run lint   - Ejecutar linter"
echo "========================================"
