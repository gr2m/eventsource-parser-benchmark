// based on https://github.com/rexxars/eventsource-parser/issues/19

import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set");
}

const OUTPUT_PATH = "recorded/image-of-a-black-cat";

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?alt=sse",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GOOGLE_API_KEY,
    },
    body: JSON.stringify({
      generationConfig: {
        temperature: 0,
        responseModalities: ["TEXT", "IMAGE"],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Generate an image of a black cat",
            },
          ],
        },
      ],
    }),
  },
);

const nodeReadable = Readable.fromWeb(response.body);
const fileWritable = fs.createWriteStream(OUTPUT_PATH);

await pipeline(nodeReadable, fileWritable);
console.log(`Recorded stream to ${OUTPUT_PATH}`);
