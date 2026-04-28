---
name: add-domain-entity
description: Add a new LoL domain entity (type, Valibot schema, mock data, and API route) to libs/domain and libs/data-access
---

# Add a Domain Entity

Adds a typed entity to `libs/domain` with a Valibot schema, mock seed data, and a Hono API route in `libs/data-access`.

## Steps

### 1. Define the type and schema in `libs/domain`

Create `libs/domain/src/entities/${input:entityName}.ts`:

```ts
import * as v from 'valibot'

export const ${input:entityName}Schema = v.object({
  id: v.string(),
  // ... add fields
})

export type ${input:EntityName} = v.InferOutput<typeof ${input:entityName}Schema>
```

Export from `libs/domain/src/index.ts`.

### 2. Add mock/seed data

Create `libs/domain/src/mocks/${input:entityName}.mock.ts`:

```ts
import type { ${input:EntityName} } from '../entities/${input:entityName}'

export const mock${input:EntityName}s: ${input:EntityName}[] = [
  // 5–10 realistic LoL entries
]
```

Reference real LoL data from [Data Dragon](https://ddragon.leagueoflegends.com/cdn/14.1.1/data/en_US/champion.json) for accuracy.

### 3. Add data-access hooks/fetchers

Create `libs/data-access/src/${input:entityName}.ts`:

```ts
import * as v from 'valibot'
import { ${input:entityName}Schema } from '@rift/domain'

export async function get${input:EntityName}s() {
  const res = await fetch('/api/${input:entityName}s')
  return v.parse(v.array(${input:entityName}Schema), await res.json())
}

export async function get${input:EntityName}(id: string) {
  const res = await fetch(`/api/${input:entityName}s/${id}`)
  return v.parse(${input:entityName}Schema, await res.json())
}
```

### 4. Add Hono API router

Create `libs/data-access/src/routers/${input:entityName}.router.ts`:

```ts
import { Hono } from 'hono'
import { mock${input:EntityName}s } from '@rift/domain/mocks'

export const ${input:entityName}Router = new Hono()

${input:entityName}Router.get('/', (c) => c.json(mock${input:EntityName}s))

${input:entityName}Router.get('/:id', (c) => {
  const entity = mock${input:EntityName}s.find(e => e.id === c.req.param('id'))
  if (!entity) return c.notFound()
  return c.json(entity)
})
```

Register in the app's `server/index.ts`:

```ts
app.route('/api/${input:entityName}s', ${input:entityName}Router)
```

### 5. Run tests

```bash
pnpm nx run domain:test
pnpm nx run data-access:test
```
