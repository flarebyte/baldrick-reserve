#!/usr/bin/env node
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * Run: `npx zx --install reserve-schema/entity-schema.mjs`
 */

const entity = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  purpose: z.string(),
  mustHave: z.array(z.string()),
  shouldHave: z.array(z.string()),
  niceToHave: z.array(z.string()),
  shouldNotHave: z.array(z.string()),
});

const schema = z
  .object({
    entities: z.array(entity),
  })
  .describe("Entities schema");

const jsonSchema = zodToJsonSchema(schema, "entities-schema");

await fs.writeJson("reserve-schema/entities.schema.json", jsonSchema, {
  spaces: 2,
});
