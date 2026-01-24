const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    // Intercept OPTIONS requests to /api and approve them locally
    app.use('/api', (req, res, next) => {
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow frontend origin
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            res.header('Access-Control-Allow-Credentials', 'true');
            return res.sendStatus(200);
        }
        next();
    });

    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            secure: false,
            onProxyReq: (proxyReq) => {
                // Strip headers to mimic a direct tool/curl request (clean slate)
                proxyReq.removeHeader('Origin');
                proxyReq.removeHeader('Referer');
                proxyReq.removeHeader('Cookie');
            }
        })
    );
};
