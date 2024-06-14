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

    if (req.hostname === 'verify.fryfoundation.com' || req.hostname === 'explorer.fryfoundation.com' || req.hostname === 'dashboard.fryfoundation.com') {
        // Serve static files for these hostnames
        // No URL modification needed, as express.static handles it
    } else if (req.hostname === 'byod.fryfoundation.com') {
        req.url = '/byod' + req.url; // Add your app path
    } else if (req.hostname === 'weather.fryfoundation.com') {
        req.url = '/weather' + req.url; // Add your app path
    } else if (req.hostname === 'registration.fryfoundation.com') {
        req.url = '/registration' + req.url; // Add your app path
    } else if (req.hostname === 'admin.fryfoundation.com') {
        req.url = '/admin' + req.url; // Add your app path
    }else if (req.hostname === 'air.fryfoundation.com') {
        req.url = '/air' + req.url; // Add your app path
    }else if (req.hostname === 'api.fryfoundation.com') {
        req.url = '/api' + req.url; // Add your app path
    } else if (req.hostname === 'dao.fryfoundation.com') {
        req.url = '/dao' + req.url; // Add your app path
    } else if (req.hostname === 'water.fryfoundation.com') {
        req.url = '/water' + req.url; // Add your app path
    }
    else if (req.hostname === 'energy.fryfoundation.com') {
        req.url = '/energy' + req.url; // Add your app path
    } else {
        console.log(`unknown host ${req.hostname}`);
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
server.use('/dao', createProxyMiddleware({ target: 'http://localhost:3012', changeOrigin: true }));
server.use('/water', createProxyMiddleware({ target: 'http://localhost:3013', changeOrigin: true }));
server.use('/energy', createProxyMiddleware({ target: 'http://localhost:3015', changeOrigin: true }));

server.listen(port, (err?: unknown) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
});
