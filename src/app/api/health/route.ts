import { connection } from 'next/server';

import { getAppOrigin, getBackendConfig } from '$shared/api/server/config';

export const GET = async (request: Request) => {
  await connection();

  try {
    getAppOrigin(request.url);
    getBackendConfig();

    return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json(
      { code: 'APP_NOT_READY', message: 'Конфигурация приложения некорректна' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
};
