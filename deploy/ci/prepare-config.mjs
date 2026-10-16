import fs from 'node:fs';
import { isIP } from 'node:net';
import path from 'node:path';

const required = [
  'RUNNER_TEMP',
  'VPS_HOST',
  'VPS_USER',
  'VPS_PRIVATE_KEY',
  'VPS_HOST_FINGERPRINT',
  'APP_ORIGIN',
  'API_BASE_URL',
];

for (const name of required) {
  if (!process.env[name]?.trim()) {
    throw new Error(`Не задана переменная ${name}`);
  }
}

const host = process.env.VPS_HOST.trim();
const user = process.env.VPS_USER.trim();
const fingerprint = process.env.VPS_HOST_FINGERPRINT.trim();

if (!isIP(host)) {
  throw new Error('HOST_IP должен содержать IP без протокола и порта');
}

if (!/^[a-z_][a-z0-9_-]*\$?$/.test(user)) {
  throw new Error('Некорректный USERNAME');
}

if (!/^SHA256:[A-Za-z0-9+/]{43}$/.test(fingerprint)) {
  throw new Error('Некорректный SSH_HOST_FINGERPRINT');
}

const getOrigin = (name, allowHttpIp) => {
  let url;

  try {
    url = new URL(process.env[name]);
  } catch {
    throw new Error(`Некорректный ${name}`);
  }

  const ip = isIP(url.hostname.replace(/^\[|\]$/g, ''));

  const isAllowedProtocol =
    url.protocol === 'https:' || (url.protocol === 'http:' && allowHttpIp && ip !== 0);

  if (
    !isAllowedProtocol ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(`Некорректный ${name}`);
  }

  return url.origin;
};

const runtime = {
  APP_ORIGIN: getOrigin('APP_ORIGIN', true),
  API_BASE_URL: getOrigin('API_BASE_URL', false),
};

for (const name of ['API_UPSTREAM_AUTHORIZATION', 'API_SESSION_COOKIE_NAME']) {
  if (process.env[name]) {
    runtime[name] = process.env[name];
  }
}

for (const [name, value] of Object.entries(runtime)) {
  if (/[\r\n\0]/.test(value)) {
    throw new Error(`Перенос строки в ${name}`);
  }
}

// Нормализуем переносы строк и случайные пробелы вокруг блока ключа.
const privateKey = process.env.VPS_PRIVATE_KEY.replace(/\r\n?/g, '\n').trim() + '\n';

// Файлы с секретами создаются только во временной директории runner.
const dir = path.join(process.env.RUNNER_TEMP, 'demetrio-deploy');

fs.mkdirSync(dir, { recursive: true, mode: 0o700 });

fs.writeFileSync(path.join(dir, 'key'), privateKey, {
  mode: 0o600,
});

fs.writeFileSync(path.join(dir, 'expected-fingerprint'), fingerprint, { mode: 0o600 });

fs.writeFileSync(
  path.join(dir, 'runtime.conf'),
  Object.entries(runtime)
    .map(([name, value]) => `${name}=${value}`)
    .join('\n') + '\n',
  { mode: 0o600 },
);

fs.writeFileSync(path.join(dir, 'askpass'), '#!/bin/sh\nprintf "%s" "$VPS_KEY_PASSPHRASE"\n', {
  mode: 0o700,
});

fs.writeFileSync(
  path.join(dir, 'ssh_config'),
  [
    'Host demetrio-vps',
    `  HostName ${host}`,
    `  User ${user}`,
    '  Port 22',
    '  BatchMode yes',
    '  IdentitiesOnly yes',
    '  PreferredAuthentications publickey',
    '  StrictHostKeyChecking yes',
    '  ConnectTimeout 15',
    '  ServerAliveInterval 15',
    '  ServerAliveCountMax 4',
    `  IdentityFile ${dir}/key`,
    `  IdentityAgent ${dir}/agent.sock`,
    `  UserKnownHostsFile ${dir}/known_hosts`,
  ].join('\n') + '\n',
  { mode: 0o600 },
);
