#!/usr/bin/env bash
set -euo pipefail

release_id="${GITHUB_SHA:?}-${GITHUB_RUN_ID:?}-${GITHUB_RUN_ATTEMPT:?}"
image_dir="${RUNNER_TEMP:?}/demetrio-image"
output_file=${GITHUB_OUTPUT:?}

if [[ ! "$release_id" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ ]]; then
  echo 'Некорректный идентификатор сборки' >&2
  exit 1
fi

docker build --file deploy/Dockerfile --platform linux/amd64 --tag "demetrio:$release_id" .
mkdir -p "$image_dir"
docker image save "demetrio:$release_id" | gzip > "$image_dir/image.tar.gz"

echo "release_id=$release_id" >> "$output_file"

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  printf 'Коммит: `%s`\n\nРелиз: `%s`\n' "$GITHUB_SHA" "$release_id" >> "$GITHUB_STEP_SUMMARY"
fi
