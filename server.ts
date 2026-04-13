import {createRequestHandler} from '@shopify/remix-oxygen';
// @ts-ignore — virtual module provided by Remix at build time
import * as build from 'virtual:remix/server-build';

/**
 * Oxygen worker entry point.
 * Handles all incoming requests via the Fetch API pattern.
 */
export default {
  async fetch(
    request: Request,
    env: Record<string, string>,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    const handleRequest = createRequestHandler(build, 'production');

    const response = await handleRequest(request, {
      env,
      executionContext,
      waitUntil: executionContext.waitUntil.bind(executionContext),
    });

    return response;
  },
};
