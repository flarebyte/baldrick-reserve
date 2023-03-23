#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const link = z.object({
  title: z.string().min(1).max(60).describe('A title describing the link'),
  url: z.string().url().describe('The URL for the link'),
});

/** JSON like */
const literalSchema = z.union([z.string().min(1), z.number(), z.boolean()]);
const jsonishSchema = z
  .lazy(() =>
    z.union([literalSchema, z.array(jsonishSchema), z.record(jsonishSchema)])
  )
  .describe('Any JSON document without null values');

const schema = z
  .object({
    model: z.object({
      project: z
        .object({
          title: z.string().min(1).max(60).describe('Title of the project'),
          description: z
            .string()
            .min(1)
            .max(1000)
            .describe(
              'A concise description that highligths the purpose and main use case'
            ),
          version: z
            .string()
            .min(5)
            .max(20)
            .describe('The version of the package in the format 0.0.0'),
          keywords: z
            .array(z.string().min(1).max(60))
            .min(1)
            .describe('List of keywords'),
        })
        .describe('About the project'),
      readme: z
        .object({
          highlights: z
            .array(z.string().min(1).max(500))
            .describe('Main highlights for the project'),
          links: z
            .array(z.string().min(1).max(200))
            .describe('A list of links in Markdown format'),
          related: z
            .array(z.string().min(1).max(200))
            .describe('A list of related links in Markdown format'),
        })
        .describe('Information to populate the README.md'),
      github: z
        .object({
          account: z
            .string()
            .min(1)
            .max(100)
            .describe('The name of the Github account'),
          name: z
            .string()
            .min(1)
            .max(100)
            .describe('The name of the Github project'),
        })
        .describe('Information about the Github repository'),
      copyright: z
        .object({
          holder: z
            .string()
            .min(1)
            .max(100)
            .describe('The name of the copyright holder'),
          startYear: z
            .number()
            .min(2000)
            .max(2900)
            .describe('The starting year for the copyright'),
        })
        .describe('Information about the Github repository'),
      license: z
        .enum(['MIT', 'UNLICENSED'])
        .describe('License for the source code'),
      author: z
        .object({
          name: z.string().min(1).max(100).describe('The name of the author'),
          url: z.string().url().describe('The URL for the author'),
        })
        .describe('Information about the author'),
      implementation: z
        .object({
          tags: z
            .array(
              z.enum([
                'cli',
                'lib',
                'commander',
                'zod',
                'zest',
                'pest',
                'railway',
              ])
            )
            .describe('A list of tags used to trigger some code generation'),
        })
        .describe(
          'Information about the implementation that could be useful some of the code generators'
        ),
      workflowVersion: z
        .literal('0.3.0')
        .describe(
          'Version for the model and workflow of the baldrick-broth config file'
        ),
    }),
    workflows: jsonishSchema,
  })
  .describe('Describe the model for a typical typescript project');
const jsonSchema = zodToJsonSchema(schema, 'typescript-broth');

await fs.writeJson('reserve-schema/ts-broth.schema.json', jsonSchema, {
  spaces: 2,
});
