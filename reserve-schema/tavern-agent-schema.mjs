#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { dataKind } from './tavern-common.mjs'

const smallParagraph = z.string().min(1).max(1000);

const conciseParagraph = z.string().min(1).max(600);
const shortName = z.string().min(1).max(40);
const shortTitle = z.string().min(1).max(60);

const unit = z.string().min(1).max(40).describe('Unit of the data');
const examples = z.array(shortName).min(1).max(20).optional();

const parameter = z.object({
  name: shortName,
  description: conciseParagraph.describe('Description for the option'),
  kind: dataKind,
  units: z.array(unit).min(1).max(20).optional(),
  examples,
  default: z.string().min(1).max(200).optional(),
  mandatory: z.boolean().default(false),
});

const schema = z
  .object({
    name: shortName.describe('Short name for the tavern agent'),
    title: shortTitle.describe('Title for the tavern agent'),
    enginePath: z.string().min(1).max(150),
    description: smallParagraph.describe('Description of the agent'),
    parameters: z.array(parameter).min(1).max(10).optional(),
    prompt: z.string().min(1).max(2000),
  })
  .describe('Agent for Baldrick tavern');

const jsonSchema = zodToJsonSchema(schema, 'baldrick-tavern-agent-schema');

await fs.writeJson('reserve-schema/tavern-agent.schema.json', jsonSchema, {
  spaces: 2,
});
