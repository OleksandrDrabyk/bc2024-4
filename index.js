const http = require('http');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const fsPromises = fs.promises;

program
  .option('-h, --host <host>', 'address of the server')
  .option('-p, --port <port>', 'port of the server')
  .option('-c, --cache <cacheDir>', 'path to cache directory')
  .parse(process.argv);

const options = program.opts();

if (!options.host || !options.port || !options.cache) {
  console.error("Помилка: не задано обов'язковий параметр.");
  console.error("Будь ласка, вкажіть усі обов'язкові параметри: --host, --port, --cache.");
  process.exit(1);
}
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Сервер працює');
});
if (req.method === 'GET') {
    const fileContent = await fsPromises.readFile(cacheFilePath);
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(fileContent);

  }else if (req.method === 'PUT') {
    const fileContent = [];
    req.on('data', chunk => fileContent.push(chunk));
    req.on('end', async () => {
      await fsPromises.writeFile(cacheFilePath, Buffer.concat(fileContent));
      res.writeHead(201, { 'Content-Type': 'text/plain' });
      res.end('Created');
    });
server.listen(options.port, options.host, () => {
  console.log(`Сервер запущено за адресою http://${options.host}:${options.port}/`);
});

