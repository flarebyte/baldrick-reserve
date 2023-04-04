#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const smallParagraph = z.string().min(1).max(1000);

const conciseParagraph = z.string().min(1).max(600);
const shortName = z.string().min(1).max(40);

const kindMeta = {
  string: 'Any kind of string',
  'string:url': 'A url',
  'string:path': 'A path relative the current folder',
};

const describeEnum = (intro, objectValue) => {
  const description = [`${intro} with either of:`];
  for (const [name, title] of Object.entries(objectValue)) {
    description.push(`${name}: ${title}`);
  }
  return description.join('\n');
};

const kind = z
  .enum(Object.keys(kindMeta))
  .describe(describeEnum('Kind of the argument', kindMeta));

const command = z.object({
  name: shortName.describe('Short name for the command'),
  description: conciseParagraph.describe('Description of the command'),

  mainArgument: z.object({
    description: conciseParagraph.describe('Description of the argument'),
    kind,
  }),
});

const schema = z
  .object({
    name: z
      .string()
      .min(1)
      .max(40)
      .describe('Short name for the tavern engine'),
    title: z
      .string()
      .min(1)
      .max(60)
      .describe('Title summarizing the nature of the tavern engine'),
    description: z
      .string()
      .min(1)
      .max(1000)
      .describe('Description of the engine'),
    commands: z.array(command).min(1).max(50),
  })
  .describe('Model for specifying a discussion for Baldrick tavern');

const jsonSchema = zodToJsonSchema(schema, 'baldrick-tavern-engine-schema');

await fs.writeJson('reserve-schema/tavern-engine.schema.json', jsonSchema, {
  spaces: 2,
});
