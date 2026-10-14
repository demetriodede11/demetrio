#!/usr/bin/env bash
set -euo pipefail

ssh_dir="${RUNNER_TEMP:?}/demetrio-deploy"
if [[ -S "$ssh_dir/agent.sock" ]]; then
  SSH_AUTH_SOCK="$ssh_dir/agent.sock" ssh-add -D >/dev/null 2>&1 || true
fi

rm -rf -- "$ssh_dir"
