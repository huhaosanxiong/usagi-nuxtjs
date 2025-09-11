module.exports = {
  apps: [{
    name: 'nuxt-todo-app',
    exec_mode: 'cluster',
    instances: '1',
    script: './.output/server/index.mjs',
    env: {
      PORT: 3000,
      NODE_ENV: 'production'
    },
    // 重启选项
    max_memory_restart: '1G',
    // 日志配置
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    // 监控和健康检查
    wait_ready: true,
    listen_timeout: 10000,
    kill_timeout: 5000
  }]
}