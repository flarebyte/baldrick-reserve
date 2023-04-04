#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const smallParagraph = z.string().min(1).max(1000);


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
  })
  .describe('Model for specifying a discussion for Baldrick tavern');

const jsonSchema = zodToJsonSchema(schema, 'baldrick-tavern-engine-schema');

await fs.writeJson('reserve-schema/tavern-engine.schema.json', jsonSchema, {
  spaces: 2,
});
