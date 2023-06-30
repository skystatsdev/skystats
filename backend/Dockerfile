FROM rust:alpine

ARG APP=/usr/src/app

EXPOSE 8080

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN addgroup -S $APP_USER \
    && adduser -S -g $APP_USER $APP_USER

RUN apk update && apk add --no-cache ca-certificates build-base && rm -rf /var/cache/apk/*

WORKDIR ${APP}

ADD . ./

RUN cargo clean
RUN cargo build --release

RUN chown -R $APP_USER:$APP_USER ${APP}

CMD ./target/release/skystats
