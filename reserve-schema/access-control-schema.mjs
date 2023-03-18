#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const attributeName = z.string().min(1).max(100).describe('Attribute name');
const stringValues = z
  .string()
  .min(1)
  .max(100)
  .or(z.array(z.string().min(1).max(100)).max(30).min(2));
const operator = z.enum([
  'equals',
  'not-equals',
  'more-than',
  'less-than',
  'one-of',
]);

const attributeCriteria = z.object({
  attribute: attributeName,
  condition: operator,
  expectation: stringValues,
});

const allowance = z.object({
  description: z
    .string()
    .min(1)
    .max(1000)
    .optional()
    .describe('Detailed description'),
  user: z.array(attributeCriteria).min(1),
  action: z.array(attributeCriteria).min(1),
  target: z.array(attributeCriteria).min(1),
  contextual: z.array(attributeCriteria).min(1),
});

const riskFlag = z.enum([
  'medium-reward',
  'high-reward',
  'easy-hack',
  'medium-hack',
  'high-hack',
  'vulnerable-to-dev',
  'vulnerable-to-admin',
  'vulnerable-to-internal-user',
  'vulnerable-to-user',
  'vulnerable-to-anonymous-user',
]);

const risk = z
  .object({
    description: z
      .string()
      .min(1)
      .max(1000)
      .describe('Description of the risk'),
    mitigation: z
      .string()
      .min(1)
      .max(1000)
      .optional()
      .describe('Mitigation for the risk'),
    levels: z
      .array(riskFlag)
      .max(10)
      .describe('Motivation and difficulty of the hack'),
  })
  .describe('Description of the security risk');

const schema = z
  .object({
    title: z.string().min(1).max(60).describe('Title for the access control'),
    description: z
      .string()
      .min(1)
      .max(1000)
      .optional()
      .describe('Detailed description about the access control'),
    allow: z
      .array(allowance)
      .min(1)
      .max(300)
      .describe('Operations that are permitted'),
    risks: z
      .array(risk)
      .min(1)
      .max(12)
      .optional()
      .describe('Must have features'),
  })
  .describe('Access control model');

const jsonSchema = zodToJsonSchema(schema, 'access-control-schema');

await fs.writeJson('reserve-schema/access-control.schema.json', jsonSchema, {
  spaces: 2,
});
