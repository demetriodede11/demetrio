#!/usr/bin/env bash
set -euo pipefail

release_id=${RELEASE_ID:?}
if [[ ! "$release_id" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ ]]; then
  echo 'Некорректный идентификатор сборки' >&2
  exit 1
fi

remote_dir="/opt/demetrio/releases/$release_id"
ssh_dir="${RUNNER_TEMP:?}/demetrio-deploy"

ssh -F "$ssh_dir/ssh_config" demetrio-vps "umask 077; mkdir -p '$remote_dir'"
scp -F "$ssh_dir/ssh_config" "$ssh_dir/image.tar.gz" "$ssh_dir/runtime.conf" deploy/deploy.sh "demetrio-vps:$remote_dir/"
ssh -F "$ssh_dir/ssh_config" demetrio-vps "bash '$remote_dir/deploy.sh' '$release_id'"
