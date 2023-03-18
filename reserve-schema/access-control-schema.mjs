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
  value: stringValues,
});

const principal = z
  .object({
    role: z
      .array(attributeName)
      .min(1)
      .max(12)
      .optional()
      .describe('The role that is assigned to principal'),
    status: z
      .array(attributeName)
      .min(1)
      .max(12)
      .optional()
      .describe('The current status of the principal'),
    attributes: z
      .array(attributeCriteria)
      .max(12)
      .optional()
      .describe('A list of attributes'),
  })
  .describe('The role or attributes expected from principal');

const target = z
  .object({
    documents: z
      .array(attributeName)
      .min(1)
      .max(30)
      .describe('The documents that could be accessed'),
    attributes: z
      .array(attributeCriteria)
      .max(12)
      .optional()
      .describe('A list of attributes'),
  })
  .describe('Documents or attributes that are being accessed');

const allowance = z.object({
  description: z
    .string()
    .min(1)
    .max(1000)
    .optional()
    .describe('Detailed description'),
  principal,
  action: z
    .array(attributeName)
    .min(1)
    .describe('Action that can be performed by the principal'),
  target,
  contextual: z.array(attributeCriteria).min(1).optional(),
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
