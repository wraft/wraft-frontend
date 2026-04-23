#!/bin/sh
set -e

log() {
  echo "[INFO] $1"
}

required_paths="
/app/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs
/app/node_modules/redux/dist/redux.mjs
/app/node_modules/redux-thunk/package.json
/app/node_modules/immer/package.json
/app/node_modules/reselect/package.json
"

for path in $required_paths; do
  if [ ! -f "$path" ]; then
    echo "[ERROR] Missing runtime dependency artifact: $path"
    echo "[ERROR] Rebuild image with updated standalone dependency copy rules."
    exit 1
  fi
done

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