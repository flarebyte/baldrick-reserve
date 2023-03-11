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
  kind: z.enum(["uses", "is-used"]),
});

const schema = z
  .object({
    name: z.string().min(1).max(20).describe("Short name for the entity"),
    title: z.string().min(1).max(60).describe("Title"),
    description: z
      .string()
      .min(1)
      .max(1000)
      .optional()
      .describe("Detailed description"),
    purpose: z
      .string()
      .min(1)
      .max(1000)
      .optional()
      .describe("Why is this entity needed"),
    mustHave: z
      .array(z.string())
      .min(1)
      .max(12)
      .optional()
      .describe("Must have features"),
    shouldHave: z
      .array(z.string())
      .min(1)
      .max(12)
      .optional()
      .describe("Should have features"),
    niceToHave: z
      .array(z.string())
      .min(1)
      .max(12)
      .optional()
      .describe("Nice to have features"),
    shouldNotHave: z
      .array(z.string())
      .min(1)
      .max(12)
      .optional()
      .describe("Should not have features"),
    retentionPeriod: z
      .enum(["year", "month", "week", "day"])
      .describe("Period during which the data should be kept"),
    createFrequency: frequency.describe(
      "Frequency at which the entity is created"
    ),
    readFrequency: frequency.describe("Frequency at which the entity is read"),
    updateFrequency: frequency.describe(
      "Frequency at which the entity is updated"
    ),
    deleteFrequency: frequency.describe(
      "Frequency at which the entity is deleted"
    ),
    backupFrequency: frequency.describe(
      "Frequency at which the entity is backed up"
    ),
    dataSize: z
      .enum(["B", "KB", "MB", "GB", "TB"])
      .describe("Estimated size of one entity"),
    format: z
      .enum(["tabular", "key-value", "document", "graph", "time-series"])
      .describe("Expected structure of the data"),
    textSearch: z
      .boolean()
      .default(false)
      .describe("Should the entity require text search"),
    validation: z
      .array(
        z.enum([
          "basic",
          "schema",
          "service",
          "access-service",
          "curated",
          "machine-learning",
        ])
      )
      .describe("How the data is validated"),
    ownership: z
      .array(z.enum(["public", "business", "individual"]))
      .describe("Who owns the data"),
    relationhships: z
      .array(relationhship)
      .describe("Describe the relationhships with other entities"),
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
  })
  .describe("Entity model");

const jsonSchema = zodToJsonSchema(schema, "entity-schema");

await fs.writeJson("reserve-schema/entity.schema.json", jsonSchema, {
  spaces: 2,
});
