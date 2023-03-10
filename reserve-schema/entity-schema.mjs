#!/usr/bin/env node
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * Run: `npx zx --install reserve-schema/entity-schema.mjs`
 */

const frequency = z.enum([
  "never",
  "once a year",
  "once a month",
  "once a week",
  "once a day",
  "once an hour",
  "once a minute",
  "once a second",
]);

const relationhship = z.object({
  name: z.string(),
  title: z.string(),
});

const entity = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  purpose: z.string(),
  mustHave: z.array(z.string()),
  shouldHave: z.array(z.string()),
  niceToHave: z.array(z.string()),
  shouldNotHave: z.array(z.string()),
  retentionPeriod: z.enum(["year", "month", "week", "day"]),
  createFrequency: frequency,
  readFrequency: frequency,
  updateFrequency: frequency,
  deleteFrequency: frequency,
  backupFrequency: frequency,
  dataSize: z.enum(["B", "KB", "MB", "GB", "TB"]),
  format: z.enum(["tabular", "key-value", "document", "graph", "time-series"]),
  search: z.array(z.enum(["id", "text"])),
  validation: z.array(
    z.enum([
      "basic",
      "schema",
      "service",
      "access-service",
      "curated",
      "machine-learning",
    ])
  ),
  ownership: z.array(z.enum(["public", "business", "individual"])),
  parents: z.array(relationhship),
  uses: z.array(relationhship),
  fields: z.array(
    z.enum([
      "primitive",
      "line",
      "text",
      "code",
      "mime",
      "image",
      "media",
      "url",
      "ref",
      "tuple",
      "encrypted",
      "hashed",
      "secret",
    ])
  ),
  privacy: z.array(
    z.enum([
      "personal",
      "sensitive-special-category",
      "privacy-high-risk",
      "anonymous",
      "pseudonymous",
      "financial",
      "children",
      "criminal",
      "ethnic",
      "political",
      "religious",
      "trade-union",
      "health",
      "sexual-life",
      "biometric",
    ])
  ),
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
