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
  kind: z.enum([
    "uses",
    "is-used",
    "contains",
    "is contained",
    "relates to",
    "is related to",
    "depends on",
    "is dependant on",
  ]),
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
  })
  .describe("Access control model");

const jsonSchema = zodToJsonSchema(schema, "access-control-schema");

await fs.writeJson("reserve-schema/access-control.schema.json", jsonSchema, {
  spaces: 2,
});
