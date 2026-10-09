/**
 * Deploy single-VPS dengan pm2.
 *
 *   npm run build
 *   pm2 start ecosystem.config.cjs
 *   pm2 save            # supaya idup lagi setelah reboot
 *   pm2 startup         # sekali saja, ikuti instruksi yang dicetak
 *
 * Worker sengaja dikunci 1 instance (exec_mode: fork, instances: 1).
 * Klaim job pakai SQLite, dan scale worker akan membuat dua proses
 * berebut job yang sama. Kalau mau multi-worker, pindah ke PostgreSQL
 * dan klaim job harus pakai SELECT ... FOR UPDATE SKIP LOCKED.
 */
module.exports = {
  apps: [
    {
      name: 'klipchip-web',
      script: 'npm',
      args: 'run start',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      autorestart: true,
      max_restarts: 10,
      // Restart sebelum mati karena kebanjiran request, bukan karena leak normal.
      max_memory_restart: '512M',
      time: true,
      error_file: 'storage/logs/web-error.log',
      out_file: 'storage/logs/web-out.log',
    },
    {
      name: 'klipchip-worker',
      script: 'npm',
      args: 'run worker',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_restarts: 20,
      // Worker memegang ffmpeg + mp4 1080x1920 di memori sementara.
      max_memory_restart: '1500M',
      time: true,
      error_file: 'storage/logs/worker-error.log',
      out_file: 'storage/logs/worker-out.log',
    },
  ],
};
