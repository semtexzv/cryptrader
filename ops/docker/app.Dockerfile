FROM base/archlinux:latest


RUN pacman -Sy --noconfirm zeromq postgresql-libs dnsutils; pacman -Scc --noconfirm

ARG app_name
ADD target/debug/$app_name /app

ENTRYPOINT ["/app"]