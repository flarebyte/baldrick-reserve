#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const smallParagraph = z.string().min(1).max(1000);

const conciseParagraph = z.string().min(1).max(600);
const shortName = z.string().min(1).max(40);
const shortTitle = z.string().min(1).max(60);

const kindMeta = {
  string: 'Any kind of string',
  'string:url': 'A url',
  'string:path': 'A path relative the current folder',
  'string:github:project': 'A github project',
  'code:json': 'An JSON payload',
  'code:yaml': 'An YAML payload',
  'code:javascript': 'An Javascript payload',
  'code:typescript': 'An Typescript payload',
  'code:mermaid': 'A Mermaid payload',
  'number:positive': 'A positive integer',
  'true/false': 'A boolean value',
  'yes/no': 'A boolean value',
  'yes/no/maybe': 'A boolean value and maybe',
  '5-point-scale':
    'Strongly _, Somewhat _, Neither _ nor _, Somewhat _, Strongly _',
  '7-point-scale':
    'Always, Strongly _, Somewhat _, Neither _ nor _, Somewhat _, Strongly _, Never',
  currency: 'An amount of money',
  'number:percentage': 'A percentage',
};

const describeEnum = (intro, objectValue) => {
  const description = [`${intro} with either:`];
  for (const [name, title] of Object.entries(objectValue)) {
    description.push(`${name}: ${title}`);
  }
  return description.join('\n');
};

const kind = z
  .enum(Object.keys(kindMeta))
  .describe(describeEnum('Kind of the data', kindMeta));

const unit = z.string().min(1).max(40).describe('Unit of the data');

const commandOption = z.object({
  name: shortName,
  description: conciseParagraph.describe('Description for the option'),
  kind,
  units: z.array(unit).min(1).max(20).optional(),
  typical: z.array(shortName),
  default: z.string().min(1).max(200).optional(),
  mandatory: z.boolean().default(false),
});

const columnName = z.object({
  name: shortName,
  description: conciseParagraph.describe('Description for the column'),
  kind,
  units: z.array(unit).min(1).max(20).optional(),
  typical: z.array(shortName),
  default: z.string().min(1).max(200).optional(),
  mandatory: z.boolean().default(false),
});

const looseFieldFormat = z.object({
  name: shortName,
  description: conciseParagraph.describe(
    'Description for the field loose format'
  ),
  kind,
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
});

const schema = z
  .object({
    name: shortName.describe('Short name for the tavern engine'),
    title: shortTitle.describe(
      'Title summarizing the nature of the tavern engine'
    ),
    description: smallParagraph.describe('Description of the engine'),
    commands: z.array(command).min(1).max(50),
    output: z.array(output),
  })
  .describe('Model for specifying a discussion for Baldrick tavern');

const jsonSchema = zodToJsonSchema(schema, 'baldrick-tavern-engine-schema');

await fs.writeJson('reserve-schema/tavern-engine.schema.json', jsonSchema, {
  spaces: 2,
});
