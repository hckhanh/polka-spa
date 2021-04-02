const polka = require("polka");
const sirv = require("sirv");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const { createLightship } = require("lightship");

/**
 * Initial environment variables
 */

const { PORT = 3000, BUILD_PATH, ENABLE_GZIP } = process.env;
const corsConfigs = require("./configs/cors");
const helmetConfigs = require("./configs/helmet");

const app = polka();
const serve = sirv(BUILD_PATH, { single: true });

/**
 * Setup app middlewares
 */

ENABLE_GZIP === "true" && app.use(compression());
app
  .use(cors(corsConfigs))
  .use(
    helmet({
      referrerPolicy: { policy: helmetConfigs.referrerPolicy },
      contentSecurityPolicy: helmetConfigs.enableCsp && helmetConfigs.csp,
    })
  )
  .use(serve)
  .listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server is ready at http://localhost:${PORT}`);
  });

/**
 * Setup Lightship for Kubernetes
 */

const lightship = createLightship();

lightship.registerShutdownHandler(() => {
  app.server.close();
});

lightship.signalReady();
