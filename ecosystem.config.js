module.exports = {
  apps: [
    {
      name: 'hororok-server',
      script: './dist/apps/hororok-server/main.js',
      env: {
        PORT: process.env.HOROROK_SERVER_PORT,
      },
    },
    {
      name: 'timer-app',
      script: './dist/apps/timer-app/main.js',
      env: {
        PORT: process.env.TIMER_APP_PORT,
      },
    },
  ],
};
