import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import next from 'next';

const port = 3000; // change to your desired port
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use((req, res, next) => {

        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(req.hostname)) {
            res.status(403).send('Direct access is not allowed');
            return;
        }

        if (req.hostname === 'byod.fryfoundation.com') {
            req.url = '/byod' + req.url; // add your app path
        } else if (req.hostname === 'weather.fryfoundation.com') {
            req.url = '/weather' + req.url; // add your app path
        } else {
            res.status(403).send('Unknown host');
            return;
        }
        next();
    });

    server.use('/byod', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
    server.use('/weather', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err?: unknown) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
}).catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});
