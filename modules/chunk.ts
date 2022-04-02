function chunk(buffer: Buffer, maxBytes: number, callback: (iterations: number) => any = () => {}) {
    if (buffer.byteLength <= maxBytes) return [buffer];

    let total = Math.ceil(buffer.byteLength / maxBytes), iter = 1;

    const result: Buffer[] = [];
    while (buffer.length) {
        if (buffer.length < maxBytes) return [...result, buffer.slice(0, buffer.length)];

        result.push(buffer.slice(0, maxBytes));
        iter++;
        buffer = buffer.slice(maxBytes);
        callback(+(iter * 100 / total).toFixed(1));
    }

    return result;
}

export default chunk;
