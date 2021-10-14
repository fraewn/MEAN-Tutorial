const http = require('http');
const debug = require('debug')("node-angular");
const app = require('./backend/app')

const normalizePort = val => {
  var port = parseInt(val, 10);
  // named pipe
  if(isNaN(port)){
    return val;
  }
  if(port>=0){
    return port;
  }
  return false;
};

const onError = error => {
  if(error.syscall !== "listen"){
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch(error.code){
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set('port', port);

const server = http.createServer(app);
// onError function is called when error is thrown
server.on("error", onError);
// onListening function is called when listening starts
server.on("listening", onListening);
// start server
server.listen(port);
