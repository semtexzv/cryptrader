FROM registry.fedoraproject.org/fedora-minimal:30


RUN microdnf install glibc postgresql-devel dnsutils && microdnf clean all
ENV RUST_BACKTRACE=full


#RUN rm /etc/pacman.d/mirrorlist
#RUN echo "Server = http://mirrors.evowise.com/archlinux/\$repo/os/\$arch" >> /etc/pacman.d/mirrorlist

#RUN pacman-db-upgrade; pacman -Syy --noconfirm glibc zeromq postgresql-libs dnsutils iproute2; pacman -Scc --noconfirm

ARG app_file
ADD $app_file /app

ARG src_dir
ADD $src_dir /src

ENTRYPOINT ["/app"]