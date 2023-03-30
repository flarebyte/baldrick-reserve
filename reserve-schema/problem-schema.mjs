#!/usr/bin/env node
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
