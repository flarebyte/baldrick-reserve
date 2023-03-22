#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const link = z.object({
  title: z.string().min(1).max(60).describe('A title describing the link'),
  url: z.string().url().describe('The URL for the link'),
});

const bulletPoint = z.string().min(1).max(500);

const technology = z.object({
  name: z.string().min(1).max(30).describe('A short name for the technology'),
  title: z.string().min(1).max(60).describe('A title for the technology'),
  description: z
    .string()
    .min(1)
    .max(1000)
    .describe('A description for the technology'),
  team: z
    .object({
      skill: z
        .enum(['aware', 'novice', 'professional', 'expert'])
        .describe('Skill level of the team'),
      interest: z.enum(['low', 'medium', 'high']),
      learningInDays: z
        .number()
        .positive()
        .describe(
          'Number of days required to learn the technology to a novice level'
        ),
    })
    .describe('Team or company perception of the technology'),
  advantages: z
    .array(bulletPoint)
    .max(20)
    .optional()
    .describe('List of advantages of the technology'),
  drawbacks: z
    .array(bulletPoint)
    .max(20)
    .optional()
    .describe('List of drawbacks of the technology'),
  usecases: z
    .array(bulletPoint)

    .max(20)
    .optional()
    .describe('List of use cases for the technology'),
  links: z.array(link).min(1).max(30),
});

const schema = z
  .object({
    title: z
      .string()
      .min(1)
      .max(60)
      .describe(
        'Title describing the use of technologies in the workgroup or company'
      ),
    description: z
      .string()
      .min(1)
      .max(1000)
      .describe(
        [
          'Description of the technologies and the list of actions including:',
          '- the wider context',
          '- the desired focus',
          '- a list of points you want to address',
        ].join('\n')
      ),
    technologies: z
      .array(technology)
      .min(1)
      .max(100)
      .describe('List of technologies used'),
  })
  .describe('Model for the technology stack');

const jsonSchema = zodToJsonSchema(schema, 'typescript-broth');

await fs.writeJson('reserve-schema/ts-broth.schema.json', jsonSchema, {
  spaces: 2,
});
