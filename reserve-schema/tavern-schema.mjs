#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const smallParagraph = z.string().min(1).max(1000);

const limits = z.object({
  budget: z.object({
    maxAmount: z.number().positive().max(10000).default(1),
    targetAmount: z.number().positive().max(10000).default(0.5),
    currency: z.enum(['pound', 'euro', 'dollar']).default('pound'),
  }),
  requests: z.number().positive().max(10000),
});

const mainTag = z.enum(['creativity:creative']);
const sectionTag = z.enum([
  'creativity:creative',
  'creativity:balanced',
  'creativity:precise',
  'output:image',
]);

const engine = z.enum([
  'openai:gpt-4',
  'openai:instructGPT:ada',
  'openai:instructGPT:babbage',
  'openai:instructGPT:curie',
  'openai:instructGPT:davinci',
  'openai:dall-e',
  'classify', // https://naturalnode.github.io/natural/bayesian_classifier.html
  'digraph',
  'fs:find',
  'git:read',
  'gh:read',
  'json:read',
  'yaml:read',
  'csv:read',
  'text:read',
]);

const section = z.object({
  title: z
    .string()
    .min(1)
    .max(80)
    .describe('Title summarizing the nature of the section'),
  engine,
  tags: z.array(sectionTag).max(50),
  persona: z.string().min(1).max(60),
  features: z
    .array(smallParagraph)
    .min(1)
    .max(24)
    .optional()
    .describe('List of features detailing the section'),
});
const schema = z
  .object({
    title: z
      .string()
      .min(1)
      .max(60)
      .describe('Title summarizing the nature of the discussion'),
    tags: z.array(mainTag).max(50),
    sections: z
      .array(section)
      .min(1)
      .max(16)
      .describe(
        'List of sections describing context, must have, should have, ...'
      ),
    limits,
  })
  .describe('Model for specifying a discussion for Baldrick tavern');

const jsonSchema = zodToJsonSchema(schema, 'baldrick-tavern-schema');

await fs.writeJson('reserve-schema/tavern.schema.json', jsonSchema, {
  spaces: 2,
});
