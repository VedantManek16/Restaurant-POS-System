const clients = [];

export const registerClient = (req, res) => {
    const { restaurantId } = req.query;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        restaurantId,
        res
    };
    clients.push(newClient);

    req.on("close", () => {
        const index = clients.findIndex(c => c.id === clientId);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
};

export const broadcastNotification = (event) => {
    const data = `data: ${JSON.stringify(event)}\n\n`;
    clients.forEach(c => {
        if (c.restaurantId === event.restaurantId) {
            c.res.write(data);
        }
    });
};
