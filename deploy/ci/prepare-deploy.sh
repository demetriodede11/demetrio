#!/usr/bin/env bash
set -euo pipefail
umask 077

node deploy/ci/prepare-config.mjs
ssh_dir="${RUNNER_TEMP:?}/demetrio-deploy"

# До авторизации сверяем ключ VPS с отпечатком из GitHub Secrets.
ssh-keyscan -T 10 -t ed25519 "$VPS_HOST" > "$ssh_dir/known_hosts" 2>/dev/null
actual_fingerprint=$(ssh-keygen -lf "$ssh_dir/known_hosts" | awk '{print $2}' | sort -u)
expected_fingerprint=$(cat "$ssh_dir/expected-fingerprint")

if [[ "$actual_fingerprint" != "$expected_fingerprint" ]]; then
  echo 'Отпечаток SSH-сервера не совпадает с SSH_HOST_FINGERPRINT' >&2
  exit 1
fi

ssh-agent -a "$ssh_dir/agent.sock" >/dev/null
if ! SSH_AUTH_SOCK="$ssh_dir/agent.sock" SSH_ASKPASS="$ssh_dir/askpass" SSH_ASKPASS_REQUIRE=force DISPLAY=:0 ssh-add "$ssh_dir/key" </dev/null >/dev/null 2>&1; then
  echo 'Не удалось загрузить SSH_PRIVATE_KEY; проверь ключ и SSH_KEY_PASSPHRASE' >&2
  exit 1
fi

ssh -F "$ssh_dir/ssh_config" demetrio-vps 'docker info >/dev/null'
