#!/usr/bin/env bash
set -euo pipefail

release_id=${RELEASE_ID:?}
if [[ ! "$release_id" =~ ^([0-9a-f]{40})-([0-9]+)-([0-9]+)$ ]]; then
  echo 'Некорректный идентификатор сборки' >&2
  exit 1
fi

if [[ "${BASH_REMATCH[1]}" != "${GITHUB_SHA:?}" || "${BASH_REMATCH[2]}" != "${GITHUB_RUN_ID:?}" ]]; then
  echo 'Сборка не соответствует коммиту или запуску workflow' >&2
  exit 1
fi

attempt=${GITHUB_RUN_ATTEMPT:?}
if [[ ! "$attempt" =~ ^[1-9][0-9]*$ ]]; then
  echo 'Некорректный номер попытки workflow' >&2
  exit 1
fi

# Deploy делает checkout main после ожидания очереди. Этот SHA проверяем локально:
# ни отдельного GitHub API, ни дополнительных прав токена для этого не нужно.
current_sha=$(git rev-parse HEAD)
if [[ ! "$current_sha" =~ ^[0-9a-f]{40}$ ]]; then
  echo 'Не удалось определить текущий коммит main' >&2
  exit 1
fi

# Re-run — явное ручное действие. Оно разрешает повторно развернуть старую сборку.
deploy=false
if [[ "$current_sha" == "$GITHUB_SHA" || "$attempt" -gt 1 ]]; then
  deploy=true
  message="Деплой релиза $release_id."
  if [[ "$attempt" -gt 1 ]]; then
    message="$message Ручной повтор разрешает выбранный коммит, даже если main изменился."
  fi
else
  message="Деплой пропущен: коммит $GITHUB_SHA уже не является текущим main."
fi

echo "deploy=$deploy" >> "${GITHUB_OUTPUT:?}"
echo "$message"
if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  printf '%s\n' "$message" >> "$GITHUB_STEP_SUMMARY"
fi
