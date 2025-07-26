module.exports = {
  apps: [
    {
      name: 'citalf-trading',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3000,
        BROWSER: 'none',
        DISABLE_ESLINT_PLUGIN: true,
      },
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
    },
  ],
};
