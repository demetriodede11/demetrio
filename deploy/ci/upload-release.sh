#!/usr/bin/env bash
set -euo pipefail

release_id=${RELEASE_ID:?}
if [[ ! "$release_id" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ ]]; then
  echo 'Некорректный идентификатор сборки' >&2
  exit 1
fi

deployment_attempt=${GITHUB_RUN_ATTEMPT:?}
if [[ ! "$deployment_attempt" =~ ^[1-9][0-9]*$ ]]; then
  echo 'Некорректный номер попытки деплоя' >&2
  exit 1
fi

release_dir="/opt/demetrio/releases/$release_id"
remote_dir="$release_dir/attempt-$deployment_attempt"
remote_created=false
ssh_dir="${RUNNER_TEMP:?}/demetrio-deploy"

cleanup_upload() {
  result=$?
  trap - EXIT
  set +e

  # При отмене передачи удаляем её архив и конфигурацию, если запуск на VPS
  # ещё не начался. Наличие runner.lock защищает файлы независимого процесса.
  if [[ "$result" -ne 0 && "$remote_created" == true ]]; then
    ssh -o ConnectTimeout=5 -o ConnectionAttempts=1 -F "$ssh_dir/ssh_config" demetrio-vps \
      "if [ -d '$remote_dir' ] && [ ! -e '$remote_dir/runner.lock' ]; then rm -f -- '$remote_dir/image.tar.gz' '$remote_dir/runtime.conf'; fi" \
      >/dev/null 2>&1 || true
  fi
  exit "$result"
}
trap cleanup_upload EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

# Повтор Deploy использует прежний образ, но получает отдельные файлы и логи.
# mkdir без -p запрещает перезапись уже существующей попытки.
ssh -F "$ssh_dir/ssh_config" demetrio-vps "umask 077; mkdir -p '$release_dir' && mkdir '$remote_dir'"
remote_created=true
scp -F "$ssh_dir/ssh_config" "$ssh_dir/image.tar.gz" "$ssh_dir/runtime.conf" deploy/deploy.sh deploy/run-deploy.sh "demetrio-vps:$remote_dir/"
ssh -F "$ssh_dir/ssh_config" demetrio-vps "bash '$remote_dir/run-deploy.sh' '$release_id'"
