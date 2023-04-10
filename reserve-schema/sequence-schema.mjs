#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Run: `npx zx --install reserve-schema/sequence-schema.mjs`
 */

const smallParagraph = z.string().min(1).max(1000);

const conciseParagraph = z.string().min(1).max(600);
const shortName = z.string().min(1).max(40);
const shortTitle = z.string().min(1).max(60);

const technologies = z
  .array(conciseParagraph)
  .min(1)
  .max(20)
  .optional()
  .describe('List of technologies recommended for the implementation');

const lifeline = z.object({
  title: shortTitle.describe('Title for the lifeline'),
  description: conciseParagraph.describe('Description for the lifeline'),
  technologies,
  mustHave: z
    .array(z.string())
    .min(1)
    .max(12)
    .optional()
    .describe('Must have features'),
  shouldHave: z
    .array(z.string())
    .min(1)
    .max(12)
    .optional()
    .describe('Should have features'),
  niceToHave: z
    .array(z.string())
    .min(1)
    .max(12)
    .optional()
    .describe('Nice to have features'),
  shouldNotHave: z
    .array(z.string())
    .min(1)
    .max(12)
    .optional()
    .describe('Should not have features'),
});

const message = z.object({
  from: shortName,
  to: shortName,
  title: shortTitle.describe('Title for the message'),
  description: conciseParagraph.describe('Description for the message'),
});

const schema = z
  .object({
    title: shortTitle.describe('Title for the sequence model'),
    description: conciseParagraph.describe('Description '),
    technologies,
    lifelines: z.record(shortName, lifeline),
    messages: z.array(message).min(1).max(40),
  })
  .describe('Entity model');

const jsonSchema = zodToJsonSchema(schema, 'sequence');

await fs.writeJson('reserve-schema/sequence.schema.json', jsonSchema, {
  spaces: 2,
});
