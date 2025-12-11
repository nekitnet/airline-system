import { setupSocket } from './src/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import { AddressInfo } from 'net';

const dev = process.env.NODE_ENV !== 'production';
const defaultPort = process.env.PORT ? parseInt(process.env.PORT) : 3002;
const hostname = '0.0.0.0';

function isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const testServer = createServer();
        testServer.listen(port, hostname, () => {
            testServer.close(() => {
                resolve(true);
            });
        });
        testServer.on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            } else {
                resolve(false);
            }
        });
    });
}

async function findFreePort(startPort: number, maxAttempts: number = 10): Promise<number> {
    for (let i = 0; i < maxAttempts; i++) {
        const port = startPort + i;
        const available = await isPortAvailable(port);
        if (available) {
            return port;
        }
    }
    throw new Error(`Could not find a free port after ${maxAttempts} attempts`);
}

async function createCustomServer() {
    try {
        const nextApp = next({
            dev,
            dir: process.cwd(),
            conf: dev ? undefined : { distDir: './.next' }
        });

        await nextApp.prepare();
        const handle = nextApp.getRequestHandler();

        const server = createServer((req, res) => {
            if (req.url?.startsWith('/api/socketio')) {
                return;
            }
            handle(req, res);
        });

        const io = new Server(server, {
            path: '/api/socketio',
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        setupSocket(io);

        let portToUse = defaultPort;
        const isAvailable = await isPortAvailable(defaultPort);
        if (!isAvailable) {
            console.log(`Port ${defaultPort} is already in use. Searching for a free port...`);
            portToUse = await findFreePort(defaultPort);
            console.log(`Found free port: ${portToUse}`);
        }

        server.listen(portToUse, hostname, () => {
            console.log(`> Ready on http://localhost:${portToUse}`);
            console.log(`> Socket.IO server running at ws://localhost:${portToUse}/api/socketio`);
        }).on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${portToUse} became unavailable. Please try again.`);
            } else {
                console.error('Server error:', err);
            }
            process.exit(1);
        });

    } catch (err) {
        console.error('Server startup error:', err);
        process.exit(1);
    }
}

createCustomServer();
