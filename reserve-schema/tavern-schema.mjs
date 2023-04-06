#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const smallParagraph = z.string().min(1).max(1000);

const prompt = z.object({
  text: smallParagraph,
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

const agent = z.discriminatedUnion('kind', [shellAgent, gptAgent]);
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
