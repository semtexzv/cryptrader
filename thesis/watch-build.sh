inotifywait -e close_write,moved_to,create -m . |
while read -r directory events filename; do
  if [[ "$filename" =~ .*\.tex ]]; then
    make pdf  2> >(while read line; do echo -e "\e[01;31m$line\e[0m" >&2; done)
  fi
done
