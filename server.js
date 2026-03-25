import {createServer as createViteServer} from 'vite';

const PORT = 3333;

async function startServer() {
  const vite = await createViteServer({
    server: {
      host: '0.0.0.0',
      port: PORT,
      hmr: true,
    },
    appType: 'custom',
  });

  await vite.listen();
  console.log(`\n🏠 Maison Masque running at http://0.0.0.0:${PORT}\n`);
  vite.printUrls();
}

startServer().catch(console.error);
