FROM cloudron/base:4.2.0@sha256:46da2fffb36353ef714f97ae8e962bd2c212ca091108d768ba473078319a47f4 AS base

ENV APP_HOME=/app/code

RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

FROM base AS dependencies
COPY --chown=cloudron:cloudron ./package.json yarn.lock ./
RUN yarn install

FROM dependencies AS build
COPY --chown=cloudron:cloudron . .
RUN yarn build

FROM base AS production

ENV PORT=8000
ENV NODE_ENV=development
ENV APP_DATA=/app/data
ENV APP_HOME=/app/code
ENV GRAPHQL_SCHEMA_PATH=/run/graphql-schema.gql
WORKDIR $APP_HOME

COPY --chown=cloudron:cloudron ./package.json ./yarn.lock ./
RUN yarn install
COPY --chown=cloudron:cloudron ./docker-entrypoint.sh ./
COPY --chown=cloudron:cloudron --from=build $APP_HOME/dist .
RUN chown root:root docker-entrypoint.sh
RUN mkdir -p $APP_DATA && touch $APP_DATA/env && rm -rf $APP_HOME/.env && ln -s $APP_DATA/env $APP_HOME/.env

EXPOSE $PORT
CMD [ "./docker-entrypoint.sh" ]
