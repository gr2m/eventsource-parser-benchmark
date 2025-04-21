// This file is a copy of https://github.com/vercel/ai/blob/f90fecac2bf015e61ef9f5608950ec116c1c9064/packages/provider-utils/src/event-source-parser-stream.ts
// License: Apache-2.0 (https://github.com/vercel/ai/blob/f90fecac2bf015e61ef9f5608950ec116c1c9064/LICENSE)
export function createEventSourceParserStream() {
  let buffer = "";
  let event = undefined;
  let data = [];
  let lastEventId = undefined;
  let retry = undefined;
  function parseLine(line, controller) {
    // Empty line means dispatch the event
    if (line === "") {
      dispatchEvent(controller);
      return;
    }
    // Comments start with colon
    if (line.startsWith(":")) {
      return;
    }
    // Field parsing
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) {
      // field with no value
      handleField(line, "");
      return;
    }
    const field = line.slice(0, colonIndex);
    // If there's a space after the colon, it should be ignored
    const valueStart = colonIndex + 1;
    const value =
      valueStart < line.length && line[valueStart] === " "
        ? line.slice(valueStart + 1)
        : line.slice(valueStart);
    handleField(field, value);
  }
  function dispatchEvent(controller) {
    if (data.length > 0) {
      controller.enqueue({
        event,
        data: data.join("\n"),
        id: lastEventId,
        retry,
      });
      // Reset data but keep lastEventId as per spec
      data = [];
      event = undefined;
      retry = undefined;
    }
  }
  function handleField(field, value) {
    switch (field) {
      case "event":
        event = value;
        break;
      case "data":
        data.push(value);
        break;
      case "id":
        lastEventId = value;
        break;
      case "retry":
        const parsedRetry = parseInt(value, 10);
        if (!isNaN(parsedRetry)) {
          retry = parsedRetry;
        }
        break;
    }
  }
  return new TransformStream({
    transform(chunk, controller) {
      const { lines, incompleteLine } = splitLines(buffer, chunk);
      buffer = incompleteLine;
      // using for loop for performance
      for (let i = 0; i < lines.length; i++) {
        parseLine(lines[i], controller);
      }
    },
    flush(controller) {
      parseLine(buffer, controller);
      dispatchEvent(controller);
    },
  });
}
// performance: send in already scanned buffer separately, do not scan again
function splitLines(buffer, chunk) {
  const lines = [];
  let currentLine = buffer;
  // using for loop for performance
  for (let i = 0; i < chunk.length; ) {
    const char = chunk[i++];
    // order is performance-optimized
    if (char === "\n") {
      // Standalone LF
      lines.push(currentLine);
      currentLine = "";
    } else if (char === "\r") {
      lines.push(currentLine);
      currentLine = "";
      if (chunk[i + 1] === "\n") {
        i++; // CRLF case: Skip the LF character
      }
    } else {
      currentLine += char;
    }
  }
  return { lines, incompleteLine: currentLine };
}
