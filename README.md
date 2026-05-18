# chain-indexer

[Subsquid](https://docs.subsquid.io)-based archival indexer for the LLM
Mining Network chain. Follows blocks, extrinsics, and events emitted by
`chain-node` (which wraps `pallet-suite/runtime`) and writes them into
Postgres-backed entities for downstream consumers (explorer-web,
status-page, validator-watcher, billing-bridge).

## Status

**Skeleton, typecheck + lint + unit-test green.**

```bash
npm install
npm run typecheck     # tsc --noEmit, green
npm run lint          # eslint, 0 warnings
npm test              # vitest, 3/3 pass
```

What is wired:

- `SubstrateBatchProcessor` builder pointed at `ws://127.0.0.1:9944` by
  default, with optional `ARCHIVE_GATEWAY`.
- Field selection covering block timestamp/state-root/extrinsics-root,
  extrinsic fee/tip/success/signature, and event name/args.
- Event subscriptions for every pallet listed in §Scope.
- Handler files (`src/handlers/{core,jobs,bme,slashing,operators}.ts`)
  that consume strongly-typed events and upsert into TypeORM entities.
- Hand-written entity stubs in `src/model/index.ts` mirroring
  `schema.graphql` exactly (so `sqd codegen` is a drop-in replacement
  later).
- Hand-typed event interfaces in `src/types/events.ts` (replaced by
  `sqd typegen` output once the chain emits stable metadata).
- `docker-compose.yml` for local Postgres.
- `.env.example` documenting every runtime knob.

What is **not** wired (out of skeleton scope):

- An actual chain to index. Until `chain-node` is bootable (it currently
  compiles but the service layer is stubbed; see `chain-node/README.md`),
  `npm run processor:start` will sit retrying RPC against an unreachable
  endpoint.
- `sqd typegen` codegen. Pallet event signatures here are hand-coded; they
  match `pallet-suite`'s declared events but won't auto-track schema drift.
- GraphQL server (the Subsquid `graphql-server` image is commented out in
  `docker-compose.yml`).
- Migrations. `npm run db:migrate` is a stub `echo`; the real
  `subsquid-typeorm-migration generate` runs once the entity set is final
  and we point at a live database.

## Layout

```
chain-indexer/
├── package.json              # @subsquid/* + typeorm + pg + dev tooling
├── tsconfig.json             # strict TS, decorators on
├── .eslintrc.json
├── .env.example
├── docker-compose.yml        # postgres:16-alpine
├── schema.graphql            # GraphQL entities (source of truth)
├── src/
│   ├── main.ts               # entry, builds processor + run loop
│   ├── config.ts             # env → typed config
│   ├── model/index.ts        # TypeORM entities (hand-written stubs)
│   ├── types/
│   │   ├── context.ts        # Ctx/IndexerBlock/IndexerEvent aliases + FIELDS
│   │   └── events.ts         # hand-typed pallet event shapes
│   └── handlers/
│       ├── core.ts           # Block/Extrinsic/Event capture
│       ├── jobs.ts           # pallet-job-market lifecycle
│       ├── bme.ts            # pallet-bme burn/mint
│       ├── slashing.ts       # pallet-slashing slash/dispute
│       └── operators.ts      # pallet-operator-stake register/heartbeat
└── tests/processor.test.ts   # wiring sanity checks
```

## Scope (indexed pallet events)

| Pallet | Events |
|---|---|
| `pallet-job-market` | `JobSubmitted`, `JobAssigned`, `JobFinalized`, `JobDisputed` |
| `pallet-bme` | `Burned`, `Minted` |
| `pallet-slashing` | `SlashOpened`, `SlashConfirmed`, `DisputeOpened` |
| `pallet-operator-stake` | `Registered`, `Heartbeat`, `Slashed` |

The full block/extrinsic/event wall is always recorded — pallet-specific
handlers extend rows with domain models.

## Running locally

```bash
docker compose up -d                       # postgres
cp .env.example .env                       # tune to taste
npm run db:migrate                         # (stubbed) apply schema
npm run processor:start                    # indexer
```

When `chain-node --dev` is bootable (currently stubbed; see
`chain-node/README.md`), the indexer will follow that RPC by default and
start populating entities. Until then it'll retry-loop against the
unreachable endpoint.

## Roadmap

1. **`sqd codegen`** — replace `src/model/index.ts` with auto-generated
   entities from `schema.graphql`.
2. **`sqd typegen`** — replace `src/types/events.ts` with auto-generated
   versioned event accessors from the chain metadata.
3. **Migrations** — generate the initial `migrations/0001-Init.ts` and
   wire `npm run db:migrate` to `npx squid-typeorm-migration apply`.
4. **GraphQL gateway** — uncomment the `graphql-server` block in
   `docker-compose.yml` and wire a CORS-friendly subgraph for the
   `explorer-web` consumer.
5. **Archive gateway** — point at the Subsquid Network gateway URL when
   the chain has a publicly-archived testnet.

## License

Apache-2.0
