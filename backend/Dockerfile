FROM rust:alpine

ARG APP=/usr/src/app

ENV APP_USER=appuser

RUN addgroup -S $APP_USER \
    && adduser -S -g $APP_USER $APP_USER

RUN apk update \
    && apk add --no-cache musl-dev \
    && rm -rf /var/cache/apk/*

WORKDIR ${APP}

ADD . ./

RUN cargo clean
RUN cargo build --release

RUN chown -R $APP_USER:$APP_USER ${APP}

EXPOSE 8000

CMD ./target/release/skystats
