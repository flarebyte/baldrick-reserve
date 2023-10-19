#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { describeEnum } from './tavern-common.mjs';

const shortName = z.string().min(1).max(40);
const propPath = z.string().min(1).max(400);

const widgetValues = {
  lines: 'The field can have multiple lines',
  text: 'The field contains text',
  numeral: 'The field contains a numeric value',
  choices: 'The field is picked from a list of choices',
  multiselect: 'Select multiple items from a list of options',
  checkbox: 'The field is a checkbox',
  dateTime: 'The field allows to select a date and a time',
  date: 'The field allows to select a date',
  time: 'The field allows to select a time',
  timeRange: 'The field allows to select a time period',
  rating: 'The field represents a rating',
  survey: 'The field represents a survey',
};

const widget = z
  .enum(Object.keys(widgetValues))
  .describe(describeEnum('Widget', widgetValues));

const requirements = {
  title: z.string().min(1).max(60).describe('Title for the field'),
  description: z
    .string()
    .min(1)
    .max(3000)
    .optional()
    .describe('Description for the field'),
  purpose: z
    .string()
    .min(1)
    .max(1000)
    .optional()
    .describe('Why is this entity needed'),
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
};
const formField = z.object({
  kind: z.literal('field'),
  name: shortName.describe('A short name for the field'),
  path: propPath.optional().describe('An absolute path in dot prop format'),
  relativePath: propPath.optional().describe('A relative path in dot prop format'),
  widget,
  optional: z.boolean().describe('If the field is optional').default(true),
  ...requirements,
});

const startGroup = z.object({
  kind: z.literal('start =>'),
  name: shortName.describe('A short name for the group'),
  path: propPath.optional().describe('An absolute path in dot prop format'),
  ...requirements,
});

const finishGroup = z.object({
  kind: z.literal('finish <='),
});

const component = z.discriminatedUnion('kind', [
  startGroup,
  finishGroup,
  formField,
]);

const schema = z
  .object({
    title: z
      .string()
      .min(1)
      .max(60)
      .describe('Title for the user interface form'),
    description: z
      .string()
      .min(1)
      .max(3000)
      .describe('Description for the user interface form'),
    components: z.array(component).min(1).max(500),
  })
  .describe('Form User Interface model');

const jsonSchema = zodToJsonSchema(schema, 'form-ui-schema');

await fs.writeJson('reserve-schema/form-ui.schema.json', jsonSchema, {
  spaces: 2,
});
