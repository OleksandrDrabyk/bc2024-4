const http = require('http');
const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
const { program } = require('commander');


program
  .requiredOption('-h, --host <host>', 'server address')
  .requiredOption('-p, --port <port>', 'server port')
  .requiredOption('-c, --cache <cache>', 'cache directory')
  .parse();

const { host, port, cache } = program.opts();
const fsPromises = fs.promises;


if (!options.host || !options.port || !options.cache) {
  console.error("Помилка: не задано обов'язковий параметр.");
  console.error("Будь ласка, вкажіть усі обов'язкові параметри: --host, --port, --cache.");
  process.exit(1);
}


fsPromises.mkdir(cache, { recursive: true }).catch(console.error);

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.slice(1); 
  const cacheFilePath = path.join(cache, `${urlPath}.jpg`);

  try {
    if (req.method === 'GET') {
      
      const fileContent = await fsPromises.readFile(cacheFilePath);
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(fileContent);
    } 
    else if (req.method === 'PUT') {
      const fileContent = [];
      req.on('data', chunk => fileContent.push(chunk));
      req.on('end', async () => {
        await fsPromises.writeFile(cacheFilePath, Buffer.concat(fileContent));
        res.writeHead(201, { 'Content-Type': 'text/plain' });
        res.end('Created');
      });
    } 
    else if (req.method === 'DELETE') {
      await fsPromises.unlink(cacheFilePath);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Deleted');
    } 
    else {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method Not Allowed');
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        const response = await superagent.get(`https://http.cat/${urlPath}`);
        await fsPromises.writeFile(cacheFilePath, response.body);
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(response.body);
      } catch (fetchErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    } else {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});