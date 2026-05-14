module.exports = {
  apps: [
    {
      name: "tbm-webUI",
      script: "npm",
      args: "start",
      env: {
        PORT: 3000,
        NODE_ENV: "production"
      }
    }
  ]
}
