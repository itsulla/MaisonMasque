import {createRequestHandler} from '@shopify/remix-oxygen';
// @ts-ignore — virtual module provided by Remix at build time
import * as remixBuild from 'virtual:remix/server-build';

/**
 * Oxygen worker entry point.
 *
 * createRequestHandler from @shopify/remix-oxygen takes an OPTIONS OBJECT
 * {build, mode, getLoadContext}, NOT positional args. Passing positional
 * args caused Vite to tree-shake virtual:remix/server-build down to just
 * its `mode` export, leaving the routes/assets/entry undefined at runtime
 * → "Cannot read properties of undefined (reading 'routes')" → HTTP 500.
 */
export default {
  async fetch(
    request: Request,
    env: Record<string, string>,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: 'production',
        getLoadContext: () => ({
          env,
          executionContext,
          waitUntil: executionContext.waitUntil.bind(executionContext),
        }),
      });

      return await handleRequest(request);
    } catch (error) {
      console.error('Worker fetch error:', error);
      return new Response('Internal Server Error', {status: 500});
    }
  },
};
