# webChanneler

A TypeScript/Node.js reverse proxy server that acts as a central routing hub for the Fry Networks ecosystem of web applications and services.

## Overview

webChanneler is a production-grade microservices gateway that routes incoming HTTP requests to different backend services based on subdomain routing. It serves as the entry point for all Fry Networks web applications, providing centralized routing, security, and static file serving.

## Architecture

The application uses Express.js with http-proxy-middleware to create a reverse proxy that:

- **Domain-based Routing**: Routes requests based on subdomain/hostname to specific backend services
- **Static File Serving**: Serves static assets from a centralized PHP server directory
- **Security Layer**: Implements IP blocking and security headers via Helmet
- **Request Logging**: Logs all routing activities for monitoring and debugging

## Active Services

The following services are currently active and routed through webChanneler:

| Subdomain                   | Target Service | Purpose                      |
| --------------------------- | -------------- | ---------------------------- |
| `dashboard.frynetworks.com` | localhost:3007 | Main dashboard application   |
| `byod.frynetworks.com`      | localhost:3001 | Bring Your Own Device portal |
| `admin.frynetworks.com`     | localhost:3008 | Administrative interface     |
| `vote.frynetworks.com`      | localhost:3012 | Voting system                |
| `explorer.frynetworks.com`  | localhost:3019 | Network explorer             |
| `tiles.frynetworks.com`     | localhost:3018 | Tile-based interface         |

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TypeScript

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Fry-Foundation/webChanneler.git
cd webChanneler
```

2. Install dependencies:

```bash
npm install
```

3. Build the TypeScript code:

```bash
npm run build
```

## Configuration

### Port Configuration

The server runs on port 3000 by default. To change this, modify the `port` variable in `src/main.ts`:

```typescript
const port = 3000; // change to your desired port
```

### Adding New Services

To add a new service route:

1. Add the hostname check in the middleware:

```typescript
else if (['newservice.frynetworks.com'].includes(req.hostname)) {
    req.url = '/newservice' + req.url;
}
```

2. Add the proxy configuration:

```typescript
server.use(
  "/newservice",
  createProxyMiddleware({
    target: "http://localhost:XXXX",
    changeOrigin: true,
  })
);
```

### Static Files

Static files are served from: `../phpServer/frycrypto-main/public`

To change this path, modify the `publicFolderPath` in `src/main.ts`.

## Usage

### Development Mode

Run with automatic reloading on file changes:

```bash
npm run dev
```

### Production Mode

1. Build the application:

```bash
npm run build
```

2. Start the server:

```bash
npm start
```

The server will start on `http://localhost:3000` and begin routing requests based on hostname.

## Security Features

### IP Address Blocking

Direct IP access is blocked for security. Requests made directly to the server's IP address will receive a 403 Forbidden response.

### Security Headers

The application uses Helmet to set secure HTTP headers including:

- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- And other security-related headers

### Unknown Host Protection

Requests from unrecognized hostnames are blocked with a 403 Forbidden response.

## Development

### Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (currently not implemented)

### File Structure

```
webChanneler/
├── src/
│   └── main.ts          # Main application code
├── build/               # Compiled JavaScript output
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

### TypeScript Configuration

The project uses ES2016 target with ESNext modules. Key configurations:

- Output directory: `./build`
- Root directory: `./src`
- Strict type checking enabled
- ES module interop enabled

## Dependencies

### Production Dependencies

- **express**: Web framework for Node.js
- **http-proxy-middleware**: HTTP proxy middleware for Express
- **helmet**: Security middleware for Express
- **@types/express**: TypeScript definitions for Express

### Key Features

- **Proxy Middleware**: Seamlessly forwards requests to backend services
- **Static File Serving**: Efficiently serves static assets
- **Security**: Built-in protection against common web vulnerabilities
- **Logging**: Request routing logging for monitoring

## Monitoring

The server logs all routing decisions to the console:

```
channeled dashboard.frynetworks.com to /dashboard/some-path
```

This helps with debugging and monitoring traffic patterns.

## Contributing

When adding new services or modifying routing logic:

1. Update the hostname checks in the middleware
2. Add corresponding proxy configurations
3. Update this README with the new service information
4. Test thoroughly before deploying

## License

ISC License

## Support

For issues or questions regarding webChanneler, please contact the Fry Networks development team.
