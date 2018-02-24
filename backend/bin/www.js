/**
 * Module dependencies.
 */
import * as DBHelper from '../lib/DBHelper';

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const app = require('../app');
const debug = require('debug')('postman-like:server');
const http = require('http');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
/**
 * Listen on provided port, on all network interfaces.
 */

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'mockserverdb';

// Use connect method to connect to the server
MongoClient.connect(url, (err, client) => {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  DBHelper.db = client.db(dbName);

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
});
