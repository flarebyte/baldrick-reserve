#!/usr/bin/env node
import { z } from 'zod';
import { dataKind } from './tavern-common.mjs'
import { zodToJsonSchema } from 'zod-to-json-schema';

const smallParagraph = z.string().min(1).max(1000);

const conciseParagraph = z.string().min(1).max(600);
const shortName = z.string().min(1).max(40);
const shortTitle = z.string().min(1).max(60);

const unit = z.string().min(1).max(40).describe('Unit of the data');
const examples = z.array(shortName).min(1).max(20).optional()

const commandOption = z.object({
  name: shortName,
  description: conciseParagraph.describe('Description for the option'),
  kind: dataKind,
  units: z.array(unit).min(1).max(20).optional(),
  examples,
  counterExamples: examples,
  default: z.string().min(1).max(200).optional(),
  mandatory: z.boolean().default(false),
});

const columnName = z.object({
  name: shortName,
  description: conciseParagraph.describe('Description for the column'),
  kind: dataKind,
  units: z.array(unit).min(1).max(20).optional(),
  examples,
  counterExamples: examples,
  default: z.string().min(1).max(200).optional(),
  mandatory: z.boolean().default(false),
});

const looseFieldFormat = z.object({
  name: shortName,
  description: conciseParagraph.describe(
    'Description for the field loose format'
  ),
  kind: dataKind,
  units: z.array(unit).min(1).max(20).optional(),
  examples: z.array(conciseParagraph),
});
const looseFormat = z.object({
  name: shortName,
  description: conciseParagraph.describe('Description for the loose format'),
  example: conciseParagraph,
  fields: z.array(looseFieldFormat),
});

const section = z.object({
  title: shortTitle,
  description: conciseParagraph.describe('Description for the section'),
  mandatory: z.boolean().default(false),
});

const output = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('error'),
    description: smallParagraph.describe('How to interpret the error'),
  }),
  z.object({
    kind: z.literal('markdown'),
    title: shortTitle,
    sections: z.array(section).min(1).max(20),
  }),
  z.object({
    kind: z.literal('table'),
    title: shortTitle,
    introduction: smallParagraph,
    columns: z.array(columnName).min(1).max(20),
    conclusion: smallParagraph,
  }),
  z.object({
    kind: z.literal('log'),
    title: shortTitle,
    introduction: smallParagraph,
    formats: z.array(looseFormat).min(1).max(20),
    conclusion: smallParagraph,
  }),
]);

const command = z.object({
  name: shortName.describe('Short name for the command'),
  description: conciseParagraph.describe('Description of the command'),
  options: z.array(commandOption).min(1).max(10).optional(),
  output: z.array(output).min(1).max(15),
});

const schema = z
  .object({
    name: shortName.describe('Short name for the tavern engine'),
    title: shortTitle.describe(
      'Title summarizing the nature of the tavern engine'
    ),
    description: smallParagraph.describe('Description of the engine'),
    commands: z.array(command).min(1).max(50),
  })
  .describe('Model for specifying a discussion for Baldrick tavern');

const jsonSchema = zodToJsonSchema(schema, 'baldrick-tavern-engine-schema');

await fs.writeJson('reserve-schema/tavern-engine.schema.json', jsonSchema, {
  spaces: 2,
});
