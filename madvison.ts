import {app} from "./back_end/server";



async function start() {

    async function getFreePort(start = 3000): Promise<number> {
        return new Promise((resolve) => {
            const server = Bun.serve({
                port: start,
                fetch() {
                    return new Response("ok");
                },
                error() {
                    server.stop();
                    resolve(getFreePort(start + 1));
                },
            });
            server.stop();
            resolve(start);
        });
    }


    const frontendPort = await getFreePort(5173);

    const root = "gestion-eleves-front/dist";
    const port = 5173;

    const server = Bun.serve({
        port: frontendPort,
        async fetch(req) {
            const url = new URL(req.url);
            const pathname = decodeURIComponent(url.pathname);

            let filePath = `${root}${pathname}`;
            try {
                const file = Bun.file(filePath);
                if (await file.exists()) return new Response(file);
            } catch {
            }

            return new Response(Bun.file(`${root}/index.html`));
        },
    });

    console.log(`🌐 Frontend disponible sur http://localhost:${frontendPort}`);

}

start();


