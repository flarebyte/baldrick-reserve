#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { describeEnum } from './tavern-common.mjs';

const shortName = z.string().min(1).max(40);
const shortTitle = z.string().min(1).max(60);
const conciseParagraph = z.string().min(1).max(600);
const unit = z.string().min(1).max(40).describe('Unit of the data');
const tagValues = {
  human: 'Service provide by human',
  webservice: 'Web service',
  database: 'Database'
};

const currencyValues = {
  dollar: 'American dollar',
  gbp: 'British pound',
  euro: 'Euro',
};
const tag = z
  .enum(Object.keys(tagValues))
  .describe(describeEnum('Tag', tagValues));

const currency = z
  .enum(Object.keys(currencyValues))
  .describe(describeEnum('Currency', currencyValues));

const serviceCost = z.object({
  title: shortTitle.describe('Short title for the service cost'),
  description: conciseParagraph
    .describe('Description for the service cost')
    .optional(),
  amount: z.number().positive(),
  tags: z.array(tag).min(1).max(10),
  currency: currency.optional(),
  unit,
});

const schema = z
  .object({
    title: shortTitle.describe('Title for the list of service costs'),
    currency,
    year: z.number().positive().min(1900).max(3000),
    costs: z.record(shortName, serviceCost),
  })
  .describe('Service cost');

const jsonSchema = zodToJsonSchema(schema, 'service-cost-schema');

await fs.writeJson('reserve-schema/service-cost.schema.json', jsonSchema, {
  spaces: 2,
});
