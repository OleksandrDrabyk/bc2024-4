const { Command } = require('commander');
const http = require('http');
const fs = require('fs');
const path = require('path');

const program = new Command();
program
  .requiredOption('-h, --host <host>', 'address of the server')
  .requiredOption('-p, --port <port>', 'port of the server')
  .requiredOption('-c, --cache <cacheDir>', 'path to cache directory')
  .parse(process.argv);

const { host, port, cache } = program.opts();

// Веб-сервер
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Server is running');
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});