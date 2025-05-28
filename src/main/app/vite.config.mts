import dns from 'dns';
import path from 'path';
import url from 'url';

//import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import svgr from 'vite-plugin-svgr';

const devProxyOptions = (targetUrl: string) => ({
  autoRewrite: true,
  headers: {
    'Access-Control-Allow-Origin': targetUrl,
  },
  changeOrigin: true,
  cookieDomainRewrite: 'localhost',
  secure: false,
  target: targetUrl,
});

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dns.setDefaultResultOrder('verbatim');

export default defineConfig(({ mode }) => {
  const env = Object.assign({}, process.env, loadEnv(mode, process.cwd(), ''));

  const isDev = mode === 'development';
  const {
    DISABLE_LOCAL_PROXY,
    KOUTA_BACKEND_URL,
    DEV_VIRKAILIJA_URL,
    STORYBOOK,
  } = env;

  return {
    base: '/kouta',
    build: {
      outDir: 'build',
      target: browserslistToEsbuild(),
      sourcemap: true,
    },
    resolve: {
      alias: {
        '#': path.resolve(__dirname),
      },
    },
    plugins: [
      react(),
      svgr(),
      //optimizeLodashImports(), // Tämän voi ottaa käyttöön sitten kun lodash-importit on muutettu käyttämään nimettyjä importteja
      // Tuotanto-buildissa karsitaan devaus-plugineja hidastamasta
      ...(isDev && !STORYBOOK
        ? [
            pluginRewriteAll(),
            checker({
              //typescript: true, //TS-tarkistuksen voi laittaa päälle sitten kun nykyiset TS-virheet on saatu korjattua
              eslint: {
                lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
              },
              overlay: {
                initialIsOpen: false,
              },
            }),
            basicSsl(),
          ]
        : []),
    ],
    server: {
      port: Number(env.PORT) || 3000,
      host: 'localhost',
      https: true,
      proxy: DISABLE_LOCAL_PROXY
        ? undefined
        : {
            '^/kouta-backend/.*': devProxyOptions(
              KOUTA_BACKEND_URL ?? DEV_VIRKAILIJA_URL
            ),
            //Ohjataan DEV_VIRKAILIJA_URL:ään kaikki muu paitsi "/", "/kouta" ja "/kouta/*"
            '^(?!(/$)|(/kouta$)|(/kouta/.*))':
              devProxyOptions(DEV_VIRKAILIJA_URL),
          },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['**/**.test.[jt]s(x)?'],
      setupFiles: './src/setupTests.ts',
    },
  };
});
