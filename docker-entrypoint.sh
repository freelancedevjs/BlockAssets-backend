#!/bin/bash

set -eu

echo "==> Ensure permissions"

mkdir -p /app/data

chown -R cloudron:cloudron /app/data
chown -R cloudron:cloudron /run


if [[ ! -f "$APP_HOME/.env" ]]; then
  echo "==> Linking .env on first run"

  if [[ ! -f "$APP_HOME/.storage_setup" ]]; then
    echo "==> Touch env file"
    touch $APP_DATA/env
    touch "$APP_DATA/.storage_setup"
  fi

  ln -s $APP_DATA/env $APP_HOME/.env
fi

echo "==> Update env variables"

export REDIS_HOST=${CLOUDRON_REDIS_HOST:-localhost}
export REDIS_PORT=${CLOUDRON_REDIS_PORT:-6379}
export REDIS_PASSWORD=${CLOUDRON_REDIS_PASSWORD:-}

export SMTP_HOST=${CLOUDRON_MAIL_SMTP_SERVER:-localhost}
export SMTP_PORT=${CLOUDRON_MAIL_SMTPS_PORT:-6379}
export SMTP_USERNAME=${CLOUDRON_MAIL_SMTP_USERNAME:-}
export SMTP_PASSWORD=${CLOUDRON_MAIL_SMTP_PASSWORD:-}

export DB_CONNECTION=pg

export DB_HOST=${CLOUDRON_POSTGRESQL_HOST:-postgres}
export DB_PORT=${CLOUDRON_POSTGRESQL_PORT:-5432}
export DB_USER=${CLOUDRON_POSTGRESQL_USERNAME:-postgres}
export DB_PASSWORD=${CLOUDRON_POSTGRESQL_PASSWORD:-postgres}
export DB_NAME=${CLOUDRON_POSTGRESQL_DATABASE:-backend_db}

echo "==> Starting App"
exec gosu cloudron:cloudron yarn start:docker
