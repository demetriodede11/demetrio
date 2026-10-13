import { proxyBackendRequest } from '$shared/api/server/proxy';

type TContext = { params: Promise<{ path: string[] }> };

const handleRequest = async (request: Request, { params }: TContext) =>
  proxyBackendRequest(request, (await params).path);

export const GET = handleRequest;
export const POST = handleRequest;
