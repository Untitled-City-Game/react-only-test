#!/usr/bin/env bash
set -euo pipefail

ENV="${1:?usage: deploy.sh prod|staging}"
case "$ENV" in
  prod)    ENV_FILE=".env";          REMOTE_DIR="/opt/game-server/prod" ;;
  staging) ENV_FILE=".env.staging";  REMOTE_DIR="/opt/game-server/staging" ;;
  *) echo "unknown env: $ENV" >&2; exit 1 ;;
esac

: "${DROPLET_HOST:?set DROPLET_HOST=deploy@your.droplet.ip in your shell or .envrc}"

# 1. Build server bundle locally
npm run build-server

# 2. Push code (FlatFile DB at $REMOTE_DIR/server/db is preserved — we only --delete under build/)
rsync -az --delete \
  build/ "$DROPLET_HOST:$REMOTE_DIR/build/"
rsync -az \
  package.json package-lock.json "$DROPLET_HOST:$REMOTE_DIR/"
rsync -az "$ENV_FILE" "$DROPLET_HOST:$REMOTE_DIR/.env"

# 3. Install prod deps on the remote (esbuild bundles with --packages=external, so node_modules is needed)
ssh "$DROPLET_HOST" "cd $REMOTE_DIR && npm ci --omit=dev"

# 4. Restart and report status
ssh "$DROPLET_HOST" "sudo systemctl restart game-server@$ENV && sudo systemctl status game-server@$ENV --no-pager"
