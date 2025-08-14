#!/bin/sh
set -e

log() {
  echo "[INFO] $1"
}

if ! printenv | grep -q NEXT_PUBLIC_; then
  log "No NEXT_PUBLIC_ environment variables found. Skipping replacement."
else
  log "Replacing environment variables..."

  printenv | grep NEXT_PUBLIC_ | while read -r line ; do
    key=$(echo $line | cut -d "=" -f1)
    value=$(echo $line | cut -d "=" -f2)

    if [ -z "$value" ]; then
      log "Skipping $key as it has an empty value."
      continue
    fi

    baked="BAKED_${key}"  
    find /app/apps/web/.next/ -type f -exec sed -i "s|$baked|$value|g" {} \;
  done

fi

exec "$@"