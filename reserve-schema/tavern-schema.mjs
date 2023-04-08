#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const shortName = z.string().min(1).max(40);
const shortTitle = z.string().min(1).max(60);
const smallParagraph = z.string().min(1).max(1000);
const conciseParagraph = z.string().min(1).max(600);
const smallSentence = z.string().min(1).max(200);
const quality = z.string().min(1).max(60);
const qualities = z
  .array(quality)
  .min(1)
  .max(16)
  .describe('List of qualities such as reviewed');
const section = z.object({
  title: shortTitle,
  description: conciseParagraph.describe('Description for the section'),
});

const columnName = z.object({
  name: shortName,
  description: conciseParagraph.describe('Description for the column'),
});

const output = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('same as input'),
    title: shortTitle,
    qualities,
  }),
  z.object({
    kind: z.literal('same as input annotated'),
    title: shortTitle,
    qualities,
  }),
  z.object({
    kind: z.literal('markdown'),
    title: shortTitle,
    qualities,
    sections: z.array(section).min(1).max(20),
  }),
  z.object({
    kind: z.literal('table'),
    title: shortTitle,
    qualities,
    recordName: shortTitle.describe('The name for an individual record'),
    columns: z.array(columnName).min(1).max(20),
  }),
  z.object({
    kind: z.literal('log'),
    title: shortTitle,
    qualities,
    recordName: shortTitle.describe('The name for an individual record'),
  }),
  z.object({
    kind: z.literal('properties'),
    title: shortTitle,
    qualities,
    properties: z.array(columnName).min(1).max(40),
  }),
  z.object({
    kind: z.literal('code'),
    language: z.enum(['Javascript', 'Typescript', 'Bash', 'Elm']),
    title: shortTitle,
    qualities,
  }),
]);

const prompt = z.object({
  title: shortTitle,
  provided: smallSentence,
  text: smallParagraph,
  output,
});

const checkpoint = z.object({
  name: shortName,
  description: conciseParagraph.describe('Description for the checkpoint'),
});

const review = z.object({
  title: shortTitle,
  provided: smallSentence,
  checklist: z.array(checkpoint).min(1).max(30).describe('Checklist to review'),
  output,
});

const agentId = z.string().min(1).max(40);

const shellAgent = z.object({
  kind: z.literal('shell'),
  title: z
    .string()
    .min(1)
    .max(80)
    .describe('Title summarizing the nature of the section'),
  shell: z.string().min(1).max(200),
});

const gptAgent = z.object({
  kind: z.literal('openai:text'),
  title: z
    .string()
    .min(1)
    .max(80)
    .describe('Title summarizing the nature of the section'),
  prompts: z.array(prompt).min(1).max(9).describe('List of prompts'),
});

const humanAgent = z.object({
  kind: z.literal('human'),
  title: z.string().min(1).max(80).describe('Type of human interaction'),
  reviews: z.array(review).min(1).max(9).describe('List of prompts'),
});

const agent = z.discriminatedUnion('kind', [shellAgent, gptAgent, humanAgent]);
const schema = z
  .object({
    title: z.string().min(1).max(60).describe('Title for the tavern group'),
    agents: z.record(agentId, agent).describe('List of agents.'),
  })
  .describe('Model for specifying a discussion for Baldrick tavern');

const jsonSchema = zodToJsonSchema(schema, 'baldrick-tavern-schema');

await fs.writeJson('reserve-schema/tavern.schema.json', jsonSchema, {
  spaces: 2,
});
