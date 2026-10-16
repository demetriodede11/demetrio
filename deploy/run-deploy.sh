#!/usr/bin/env bash
set -euo pipefail
umask 077

release_id=${1:?Не указан идентификатор сборки}
if [[ ! "$release_id" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ ]]; then
  echo 'Некорректный идентификатор сборки' >&2
  exit 1
fi

release_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
log_file="$release_dir/deploy.log"
status_file="$release_dir/deploy.exit"

if [[ "${2:-}" == --worker ]]; then
  # Отдельный процесс завершает замену или откат даже после отключения GitHub.
  set +e
  bash "$release_dir/deploy.sh" "$release_id"
  result=$?
  printf '%s\n' "$result" > "$status_file"
  exit "$result"
fi

# Одну попытку деплоя нельзя запустить повторно, пока её процесс ещё работает.
# Дескриптор наследуется worker-процессом: обрыв SSH не освобождает блокировку.
exec 8> "$release_dir/runner.lock"
if ! flock -n 8; then
  echo 'Эта попытка деплоя уже выполняется на VPS' >&2
  exit 1
fi

rm -f -- "$status_file"
: > "$log_file"

# nohup защищает от обрыва SSH, setsid отделяет процесс от сессии подключения.
# --wait сохраняет PID процесса живым до завершения deploy.sh.
nohup setsid --wait bash "$release_dir/run-deploy.sh" "$release_id" --worker \
  </dev/null >> "$log_file" 2>&1 &
worker_pid=$!

# При обычном запуске GitHub получает логи и реальный результат деплоя.
tail --pid="$worker_pid" -n +1 -f "$log_file"
wait "$worker_pid" || true

if [[ ! -f "$status_file" ]]; then
  echo 'Процесс деплоя завершился без результата; проверь deploy.log на VPS' >&2
  exit 1
fi

result=$(cat "$status_file")
if [[ ! "$result" =~ ^[0-9]{1,3}$ || "$result" -gt 255 ]]; then
  echo 'Некорректный результат деплоя; проверь deploy.log на VPS' >&2
  exit 1
fi
exit "$result"
