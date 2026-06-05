#!/usr/bin/env bash
set -euo pipefail

API_URL="${RENDER_API_URL:-http://localhost:8000}"
WS_URL="${API_URL/https/wss}"
WS_URL="${WS_URL/http/ws}"

export VITE_API_URL="${API_URL}/api"
export VITE_WS_URL="${WS_URL}/api"

npm install
npm run build
