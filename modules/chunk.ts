function chunk(buffer: Buffer, maxBytes: number) {
    if (buffer.byteLength <= maxBytes) return [buffer];

    const result: Buffer[] = [];
    while (buffer.length) {
        if (buffer.length < maxBytes) return [...result, buffer.slice(0, buffer.length)];

        result.push(buffer.slice(0, maxBytes));
        buffer = buffer.slice(maxBytes);
    }

    return result;
}

export default chunk;
