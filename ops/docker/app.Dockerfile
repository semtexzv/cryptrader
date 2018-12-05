FROM base/archlinux:latest
RUN pacman -Syu --noconfirm zeromq; pacman -Scc --noconfirm
ADD target/debug/dp /dp
ENTRYPOINT ["/dp"]