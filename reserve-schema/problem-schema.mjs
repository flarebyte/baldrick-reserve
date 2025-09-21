#!/usr/bin/env zx
// Usage: npx zx --install reserve-schema/problem-schema.mjs
// Purpose: Generate a JSON Schema for problem reports and tracking; writes to
//          reserve-schema/problem.schema.json.
// Example:
//   npx zx --install reserve-schema/problem-schema.mjs
// Overview: Models issues, statuses, and metadata in Zod and outputs JSON
//           Schema via zod-to-json-schema.
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const smallParagraph = z.string().min(1).max(1000);

const schema = z
  .object({
    title: z
      .string()
      .min(1)
      .max(60)
      .describe('Title summarizing the nature of the problem'),
    description: z
      .string()
      .min(1)
      .max(1000)
      .describe('A bit more detailed description of the problem'),
    context: z.string().min(1).max(1000).describe('Context of the problem'),
    usecases: z
      .array(smallParagraph)
      .min(1)
      .max(12)
      .optional()
      .describe('List of use cases showing how the problem manifest itself'),
    personas: z
      .array(smallParagraph)
      .min(1)
      .max(12)
      .optional()
      .describe('List of user personas and target audience'),
    existingSolutions: z
      .array(smallParagraph)
      .min(1)
      .max(12)
      .optional()
      .describe('Existing solutions and their limits'),
    mustHave: z
      .array(smallParagraph)
      .min(1)
      .max(12)
      .optional()
      .describe('Must have features'),
    shouldHave: z
      .array(smallParagraph)
      .min(1)
      .max(12)
      .optional()
      .describe('Should have features'),
    niceToHave: z
      .array(smallParagraph)
      .min(1)
      .max(12)
      .optional()
      .describe('Nice to have features'),
    mustNotHave: z
      .array(smallParagraph)
      .min(1)
      .max(12)
      .optional()
      .describe('Must not have features'),
    shouldNotHave: z
      .array(smallParagraph)
      .min(1)
      .max(12)
      .optional()
      .describe('Should not have features'),
  })
  .describe('Model for specifying a problem');

const jsonSchema = zodToJsonSchema(schema, 'problem-schema');

await fs.writeJson('reserve-schema/problem.schema.json', jsonSchema, {
  spaces: 2,
});
