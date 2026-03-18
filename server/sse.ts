import type { Response } from "express";

type SSEClient = {
    id: string;
    res: Response;
};

const clients: SSEClient[] = [];

export function addClient(res: Response): string {
    const id = Math.random().toString(36).slice(2);
    clients.push({ id, res });
    res.on("close", () => {
        removeClient(id);
    });
    return id;
}

function removeClient(id: string) {
    const idx = clients.findIndex((c) => c.id === id);
    if (idx !== -1) clients.splice(idx, 1);
}

export function broadcast(event: string, data: unknown) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of clients) {
        client.res.write(payload);
    }
}
