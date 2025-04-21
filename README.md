# `eventsource-parser-benchmark`

This repository contains a simple benchmark of

1. `eventsource-parser@3.0.1`
2. `eventsource-parser@3.0.0`
3. Custom implementation of `ai` ([source](https://github.com/vercel/ai/blob/487a1c06f48b0c82fee376c0b1cdfc9de29f13b4/packages/provider-utils/src/event-source-parser-stream.ts))

Based on this issue by [@wong2](https://github.com/wong2): [rexxars/eventsource-parser#19](https://github.com/rexxars/eventsource-parser/issues/19)

[@rexxars](https://github.com/rexxars) mentioned that the performance of `eventsource-parser` was greatl in version `3.0.1` improved ([comment](https://github.com/vercel/ai/issues/5325#issuecomment-2756747066)) based on the above bug report, but that the `ai` package diverged from the `eventsource-parser` prior the performance improvements.

## Benchmark

`eventsource-parser@3.0.1` is roughly 100x faster than `eventsource-parser@3.0.0` and `ai-sdk-eventsource-parser` is roughly 10x slower than `eventsource-parser@3.0.1`.

```
$ node benchmark.js
┌─────────┬─────────────────────────────┬─────────────────────┬───────────────────────┬────────────────────────┬────────────────────────┬─────────┐
│ (index) │ Task name                   │ Latency avg (ns)    │ Latency med (ns)      │ Throughput avg (ops/s) │ Throughput med (ops/s) │ Samples │
├─────────┼─────────────────────────────┼─────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼─────────┤
│ 0       │ 'ai-sdk-eventsource-parser' │ '38988637 ± 2.44%'  │ '38276813 ± 2067041'  │ '26 ± 2.28%'           │ '26 ± 1'               │ 64      │
│ 1       │ 'eventsource-parser-3.0.0'  │ '357692048 ± 0.86%' │ '355302188 ± 7421604' │ '3 ± 0.83%'            │ '3 ± 0'                │ 64      │
│ 2       │ 'eventsource-parser-3.0.1'  │ '3281850 ± 1.97%'   │ '3390104 ± 149084'    │ '307 ± 2.01%'          │ '295 ± 12'             │ 64      │
└─────────┴─────────────────────────────┴─────────────────────┴───────────────────────┴────────────────────────┴────────────────────────┴─────────┘
```

## How it works

The repository contains a recorded response from Gemini. The response can be updated by running

```
GOOGLE_API_KEY=... node record.js
```

It updates the [recorded/image-of-a-black-cat-chunks.txt](recorded/image-of-a-black-cat-chunks.txt) file which is used in the benchmark.

## License

[ISC](LICENSE)
