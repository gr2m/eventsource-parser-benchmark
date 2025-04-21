import { Readable } from "node:stream";
import fs from "node:fs";

import { Bench } from "tinybench";
import { EventSourceParserStream as EventSourceParserStream300 } from "eventsource-parser-3.0.0/stream";
import { EventSourceParserStream as EventSourceParserStream301 } from "eventsource-parser-3.0.1/stream";

import { createEventSourceParserStream } from "./ai-sdk-eventsource-parser.js";

function replayStreamFromFile(filePath) {
  const nodeReadable = fs.createReadStream(filePath);
  return Readable.toWeb(nodeReadable);
}

async function testAiSdkEventSourceParser() {
  const start = performance.now();
  const webStream = replayStreamFromFile(
    "recorded/image-of-a-black-cat-chunks.txt",
  );
  const decodedStream = webStream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(createEventSourceParserStream());

  let chunkCount = 0;
  let totalBytes = 0;
  for await (const chunk of decodedStream) {
    chunkCount++;
    totalBytes += chunk.data.length;
  }
  const end = performance.now();

  return {
    chunkCount,
    totalBytes,
    time: end - start,
  };
}

async function testEventSourceParser300() {
  const start = performance.now();
  const webStream = replayStreamFromFile(
    "recorded/image-of-a-black-cat-chunks.txt",
  );
  const decodedStream = webStream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream300());

  let chunkCount = 0;
  let totalBytes = 0;
  for await (const chunk of decodedStream) {
    chunkCount++;
    totalBytes += chunk.data.length;
  }
  const end = performance.now();
  return {
    chunkCount,
    totalBytes,
    time: end - start,
  };
}

async function testEventSourceParser301() {
  const start = performance.now();
  const webStream = replayStreamFromFile(
    "recorded/image-of-a-black-cat-chunks.txt",
  );
  const decodedStream = webStream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream301());

  let chunkCount = 0;
  let totalBytes = 0;
  for await (const chunk of decodedStream) {
    chunkCount++;
    totalBytes += chunk.data.length;
  }
  const end = performance.now();
  return {
    chunkCount,
    totalBytes,
    time: end - start,
  };
}

const bench = new Bench({
  name: "eventsource stream parser benchmark",
  time: 100,
});

bench.add("ai-sdk-eventsource-parser", testAiSdkEventSourceParser);
bench.add("eventsource-parser-3.0.0", testEventSourceParser300);
bench.add("eventsource-parser-3.0.1", testEventSourceParser301);

await bench.run();

console.table(bench.table());
