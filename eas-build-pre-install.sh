set -e

echo "🔧 Enabling Corepack and Yarn 4.9.4..."
corepack enable
corepack prepare yarn@4.9.4 --activate
yarn --version
