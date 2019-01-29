const { spawn } = require('child_process');

const spawnSpringProcess = () => {
  const springProcess = spawn('bash', ['./runSpring.sh']);

  return new Promise((resolve, reject) => {
    springProcess.stdout.pipe(process.stdout);
    springProcess.stderr.pipe(process.stderr);

    springProcess.stdout.on('data', data => {
      if (/Started Application/.test(data.toString())) {
        return resolve();
      }
    });
  });
};

const run = async () => {
  await spawnSpringProcess();

  const jestProcess = spawn('npm', ['run', 'jest:integration']);

  jestProcess.stdout.pipe(process.stdout);
  jestProcess.stderr.pipe(process.stderr);

  jestProcess.on('close', code => {
    process.exit(code);
  });
};

(async () => {
  try {
    run();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
