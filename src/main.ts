import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
const port = 3000; // change to your desired port

const server = express();
server.use(helmet());
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicFolderPath = path.resolve(__dirname, '../phpServer/frycrypto-main/public');
server.use(express.static(publicFolderPath));
server.use((req, res, next) => {
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(req.hostname)) {
        res.status(403).send('Direct access is not allowed');
        return;
    }

    if (['verify.fryfoundation.com', 'verify.frynetworks.com',
        'dashboard.fryfoundation.com', 'dashboard.frynetworks.com'].includes(req.hostname)) {
        // Serve static files for these hostnames
        // No URL modification needed, as express.static handles it
    } else if (['byod.fryfoundation.com', 'byod.frynetworks.com'].includes(req.hostname)) {
        req.url = '/byod' + req.url; // Add your app path
    } else if (['weather.fryfoundation.com', 'weather.frynetworks.com'].includes(req.hostname)) {
        req.url = '/weather' + req.url; // Add your app path
    } else if (['registration.fryfoundation.com', 'registration.frynetworks.com', 'register.frynetworks.com'].includes(req.hostname)) {
        req.url = '/registration' + req.url; // Add your app path
    } else if (['admin.fryfoundation.com', 'admin.frynetworks.com'].includes(req.hostname)) {
        req.url = '/admin' + req.url; // Add your app path
    } else if (['air.fryfoundation.com', 'air.frynetworks.com'].includes(req.hostname)) {
        req.url = '/air' + req.url; // Add your app path
    } else if (['api.fryfoundation.com', 'api.frynetworks.com'].includes(req.hostname)) {
        req.url = '/api' + req.url; // Add your app path
    } else if (['vote.fryfoundation.com', 'vote.frynetworks.com',].includes(req.hostname)) {
        req.url = '/vote' + req.url; // Add your app path
    } else if (['water.fryfoundation.com', 'water.frynetworks.com'].includes(req.hostname)) {
        req.url = '/water' + req.url; // Add your app path
    } else if (['energy.fryfoundation.com', 'energy.frynetworks.com'].includes(req.hostname)) {
        req.url = '/energy' + req.url; // Add your app path
    } else if ([ 'explorer.fryfoundation.com', 'explorer.frynetworks.com'].includes(req.hostname)) {
        req.url = '/explorer' + req.url;
    } else if (req.hostname === "tiles.frynetworks.com") {
        req.url = '/tiles' + req.url;
    } else {
        console.log(`Unknown host ${req.hostname}`);
        res.status(403).send('Unknown host');
        return;
    }

    console.log(`channeled ${req.hostname} to ${req.url}`);
    next();
});

server.use('/byod', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
server.use('/weather', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
server.use('/registration', createProxyMiddleware({ target: 'http://localhost:3007', changeOrigin: true }));
server.use('/admin', createProxyMiddleware({ target: 'http://localhost:3008', changeOrigin: true }));
server.use('/air', createProxyMiddleware({ target: 'http://localhost:3010', changeOrigin: true }));
server.use('/api', createProxyMiddleware({ target: 'http://localhost:3011', changeOrigin: true }));
server.use('/vote', createProxyMiddleware({ target: 'http://localhost:3012', changeOrigin: true }));
server.use('/water', createProxyMiddleware({ target: 'http://localhost:3013', changeOrigin: true }));
server.use('/energy', createProxyMiddleware({ target: 'http://localhost:3015', changeOrigin: true }));
server.use('/tiles', createProxyMiddleware({ target: 'http://localhost:3018', changeOrigin: true }));
server.use('/explorer', createProxyMiddleware({ target: 'http://localhost:3019', changeOrigin: true }));


server.listen(port, (err?: unknown) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
});
