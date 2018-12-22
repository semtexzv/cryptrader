FROM base/archlinux:latest


RUN pacman -Syu --noconfirm zeromq postgresql-libs; pacman -Scc --noconfirm

ARG app_name
ADD target/debug/$app_name /app
ENV RUST_LOG=trace

ENTRYPOINT ["/app"]