export function getRangeParams(range) {
    const now = Math.floor(Date.now() / 1000);

    switch (range) {
        case "1W":
            return { from: now - 7 * 24 * 60 * 60, to: now, resolution: "60" };
        case "1M":
            return { from: now - 30 * 24 * 60 * 60, to: now, resolution: "D" };
        case "3M":
            return { from: now - 90 * 24 * 60 * 60, to: now, resolution: "D" };
        case "1Y":
            return { from: now - 365 * 24 * 60 * 60, to: now, resolution: "W" };
        default:
            return { from: now - 30 * 24 * 60 * 60, to: now, resolution: "D" };
    }
}

export function formatCandleData(candleJSON) {
    if(!candleJSON || candleJSON.s !== "ok" || !Array.isArray(candleJSON.t)) {
        return [];
    }
    return candleJSON.t.map((timestamp, index) => ({
        date: new Date(timestampe * 1000).toLocaleDateString(),
        close: candleJSON.c[index],
        high: candleJSON.h[index],
        low: candleJSON.l[index],
        open: candleJSON.o[index],
        volume: candleJSON.v[index],
    }));
}