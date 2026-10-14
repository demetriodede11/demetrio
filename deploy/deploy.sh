#!/usr/bin/env bash
set -euo pipefail
umask 077

release_id=${1:?Не указан идентификатор сборки}
if [[ ! "$release_id" =~ ^[0-9a-f]{40}-[0-9]+-[0-9]+$ ]]; then
  echo 'Некорректный идентификатор сборки' >&2
  exit 1
fi

deployment_root=/opt/demetrio
release_dir="$deployment_root/releases/$release_id"
image="demetrio:$release_id"
app=demetrio
backup="demetrio-previous-$release_id"
switch_started=false
old_exists=false
old_container_id=''
old_image_id=''

cleanup_old_images() {
  local images container_ids used_images container_id used_id candidate candidate_id retained=0

  # Docker выводит образы от новых к старым. Рассматриваем только теги наших выпусков.
  if ! images=$(docker image ls --no-trunc --filter 'reference=demetrio:*' --format '{{.Repository}}:{{.Tag}} {{.ID}}'); then
    echo 'Не удалось получить список образов; очистка пропущена' >&2
    return 0
  fi
  if [[ -z "$images" ]]; then
    return 0
  fi

  if ! container_ids=$(docker container ls --all --quiet); then
    echo 'Не удалось проверить используемые образы; очистка пропущена' >&2
    return 0
  fi

  # Защищаем образы всех контейнеров, включая остановленные, и предыдущего выпуска.
  used_images="$old_image_id"
  while IFS= read -r container_id; do
    if [[ -z "$container_id" ]]; then
      continue
    fi
    if ! used_id=$(docker container inspect --format '{{.Image}}' "$container_id"); then
      echo 'Не удалось проверить используемые образы; очистка пропущена' >&2
      return 0
    fi
    used_images="$used_images $used_id"
  done <<< "$container_ids"

  while read -r candidate candidate_id; do
    if [[ ! "$candidate" =~ ^demetrio:[0-9a-f]{40}-[0-9]+-[0-9]+$ || -z "$candidate_id" ]]; then
      continue
    fi
    case " $used_images " in
      *" $candidate_id "*) continue ;;
    esac

    # Помимо защищённых образов оставляем два свежих неиспользуемых выпуска.
    retained=$((retained + 1))
    if [[ "$retained" -le 2 ]]; then
      continue
    fi
    if ! docker image rm "$candidate"; then
      echo "Не удалось удалить старый образ $candidate; проверь свободное место" >&2
    fi
  done <<< "$images"
}

finish() {
  exit_status=$?
  trap - EXIT
  set +e

  if [[ "$exit_status" -ne 0 && "$switch_started" == true ]]; then
    # Один выпуск можно деплоить повторно, поэтому различаем контейнеры по Docker ID.
    current_id=$(docker container inspect --format '{{.Id}}' "$app" 2>/dev/null)
    current_release=$(docker container inspect --format '{{index .Config.Labels "com.demetrio.release"}}' "$app" 2>/dev/null)
    if [[ -n "$current_id" && "$current_id" != "$old_container_id" && "$current_release" == "$release_id" ]]; then
      new_removed=false
      for attempt in {1..3}; do
        if docker container rm --force "$current_id" >/dev/null; then
          new_removed=true
          break
        fi
        if [[ "$attempt" -lt 3 ]]; then
          sleep 2
        fi
      done
      if [[ "$new_removed" != true ]]; then
        echo 'Не удалось удалить новый контейнер; восстановлению может мешать занятый порт' >&2
      fi
    fi

    backup_id=$(docker container inspect --format '{{.Id}}' "$backup" 2>/dev/null)
    if [[ -n "$old_container_id" && "$backup_id" == "$old_container_id" ]]; then
      docker container rename "$old_container_id" "$app"
    fi

    if [[ "$old_exists" == true ]]; then
      old_restored=false
      for attempt in {1..5}; do
        if docker container start "$old_container_id" >/dev/null; then
          running=$(docker container inspect --format '{{.State.Running}}' "$old_container_id" 2>/dev/null)
          if [[ "$running" == true ]]; then
            old_restored=true
            break
          fi
        fi
        if [[ "$attempt" -lt 5 ]]; then
          sleep 2
        fi
      done
      if [[ "$old_restored" == true ]]; then
        echo 'Предыдущий контейнер восстановлен' >&2
      else
        echo 'Не удалось восстановить предыдущий контейнер; проверь Docker на VPS' >&2
      fi
    fi
  fi

  rm -f -- "$release_dir/runtime.conf" "$release_dir/image.tar.gz"
  exit "$exit_status"
}
trap finish EXIT
trap 'exit 130' INT
trap 'exit 143' TERM HUP

# Блокировка защищает также от параллельного ручного запуска скрипта на VPS.
exec 9> "$deployment_root/deploy.lock"
flock -w 180 9

if [[ ! -f "$release_dir/runtime.conf" || ! -f "$release_dir/image.tar.gz" ]]; then
  echo 'Не получен архив образа или конфигурация запуска' >&2
  exit 1
fi
chmod 600 "$release_dir/runtime.conf"

if docker container inspect "$app" >/dev/null 2>&1; then
  managed=$(docker container inspect --format '{{index .Config.Labels "com.demetrio.managed"}}' "$app")
  if [[ "$managed" != true ]]; then
    echo 'Имя demetrio занято контейнером, созданным вне этого деплоя' >&2
    exit 1
  fi
  old_container_id=$(docker container inspect --format '{{.Id}}' "$app")
  old_image_id=$(docker container inspect --format '{{.Image}}' "$old_container_id")
  old_exists=true
fi

# Освобождаем место и проверяем образ до остановки работающего приложения.
cleanup_old_images
docker image load --input "$release_dir/image.tar.gz" >/dev/null
docker image inspect "$image" >/dev/null
health_test=$(docker image inspect --format '{{if .Config.Healthcheck}}{{if .Config.Healthcheck.Test}}{{index .Config.Healthcheck.Test 0}}{{end}}{{end}}' "$image")
if [[ "$health_test" != CMD && "$health_test" != CMD-SHELL ]]; then
  echo 'В новом образе отсутствует активный HEALTHCHECK; деплой прерван' >&2
  exit 1
fi

switch_started=true
if [[ "$old_exists" == true ]]; then
  docker container stop --timeout 30 "$app" >/dev/null
  docker container rename "$app" "$backup"
fi

docker container run --detach \
  --name "$app" \
  --restart unless-stopped \
  --publish 80:3000 \
  --env-file "$release_dir/runtime.conf" \
  --label com.demetrio.managed=true \
  --label "com.demetrio.release=$release_id" \
  --security-opt no-new-privileges=true \
  --cap-drop ALL \
  "$image" >/dev/null

health=starting
for attempt in {1..30}; do
  health=$(docker container inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{end}}' "$app")
  running=$(docker container inspect --format '{{.State.Running}}' "$app")
  if [[ "$health" == healthy && "$running" == true ]]; then
    break
  fi
  if [[ "$health" == unhealthy || "$running" != true ]]; then
    break
  fi
  sleep 3
done

if [[ "$health" != healthy || "$running" != true ]]; then
  echo 'Новый контейнер не прошёл проверку готовности' >&2
  exit 1
fi

switch_started=false
if [[ "$old_exists" == true ]]; then
  if ! docker container rm "$old_container_id" >/dev/null; then
    echo 'Приложение обновлено, но старый остановленный контейнер остался на VPS' >&2
  fi
fi
cleanup_old_images
echo "Развёрнута сборка $release_id"
