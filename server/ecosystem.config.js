module.exports = {
  apps : [{
    name: `api`,
    script    : `./server/server.js`
    //instances : `2`,
    //exec_mode : `cluster`
  },
  {
    name: "web",
    script: "pm2",
    args: "web"
  }],
}