#!/usr/bin/env zx
// Usage: npx zx reserve-schema/typescript-broth-schema.mjs
// Purpose: Generate JSON Schema for a "broth" configuration; writes
//          reserve-schema/ts-broth.schema.json.
// Note: Despite the filename, this broth model is used across languages
//       (TypeScript, Go, Dart) to drive README and workflow scaffolding.
//       The name remains for backward compatibility.
// Example:
//   npx zx reserve-schema/typescript-broth-schema.mjs
// Overview: Captures TS project config in Zod and converts to JSON Schema.
// Pinning: This script expects zod@3.24.x and zod-to-json-schema@3.24.x.
//          Please add them to your devDependencies. It does not auto-install.
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
try {
  // Ensure modules are resolvable; version is advisory only.
  await import('zod');
  await import('zod-to-json-schema');
} catch (err) {
  console.error('Missing dependencies. Install: npm i -D zod@3.24.1 zod-to-json-schema@3.24.6');
  process.exit(1);
}
import { describeEnum } from './zod-common.mjs';

const link = z.object({
  title: z.string().min(1).max(60).describe('A title describing the link'),
  url: z.string().url().describe('The URL for the link'),
});

const licenseEnum = {
  MIT: 'The MIT License is a permissive free software license originating at the Massachusetts Institute of Technology (MIT). It puts only very limited restriction on reuse and has high license compatibility',
  UNLICENSED:
    'The UNLICENSED license means that the code is not licensed and all rights are reserved by the author. This means that you cannot use, modify, or distribute the code without explicit permission from the author.',
  'Apache-2.0':
    'The Apache License 2.0 is a permissive free software license written by the Apache Software Foundation (ASF). It allows users to use, distribute, modify, and redistribute modifications under the same license. It also provides an express grant of patent rights from contributors to users',
  'GPL-3.0':
    'The GNU General Public License v3.0 (GPL-3.0) is a copyleft license that requires any copy or modification of the original code to be released under the same license. It focuses on free software remaining free and provides four freedoms to every user: the freedom to use, study, share, and improve the software.',
  ISC: 'The ISC license is a permissive free software license published by the Internet Systems Consortium (ISC). It is functionally equivalent to the simplified BSD and MIT licenses but without language deemed unnecessary following the Berne Convention.',
  'BSD-3-Clause':
    'The BSD 3-Clause License is a permissive free software license that replaced the 4-Clause BSD License in 1999. It is similar to the BSD 2-Clause License but with an additional clause that prohibits others from using the name of the copyright holder or its contributors to promote derived products without written consent.',
};

const implementationTagEnum = {
  cli: 'Command line interface program',
  lib: 'Library',
  commander:
    'command-line interface with commander.js: https://github.com/tj/commander.js',
  zod: 'zod for schema validation: https://zod.dev/',
  zest: 'zest library for testing',
  pest: 'pest library for testing',
  railway: 'railway design pattern',
};

const readmeTagEnum = {
  'image-hero': 'Image hero for the readme',
  'image-demo': 'Animated gif to demonstrate the library or the CLI',
};

const cheatsheetFormatEnum = {
  bash: 'Bash script',
  typescript: 'Typescript',
  javascript: 'Javascript',
};

const codeSnippet = z.object({
  lang: z.string().min(1).max(40).describe('Language for the code snippet'),
  snippet: z.string().min(1).max(4000).describe('Code snippet example'),
});

const envVar = z.object({
  name: z.string().min(1).max(60).describe('Environment variable name'),
  description: z.string().min(1).max(200).describe('What it controls'),
  required: z.boolean().default(false).optional(),
  default: z.string().max(200).optional(),
});

const configFile = z.object({
  path: z.string().min(1).max(200).describe('Relative file path'),
  purpose: z.string().min(1).max(200).describe('Why this config matters'),
});

const useCase = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(600),
  steps: z.array(z.string().min(1).max(200)).min(1).max(20).optional(),
  code: codeSnippet.optional(),
});

const qaItem = z.object({
  q: z.string().min(1).max(200),
  a: z.string().min(1).max(1000),
});

const troubleshootItem = z.object({
  symptom: z.string().min(1).max(200),
  cause: z.string().min(1).max(400).optional(),
  fix: z.string().min(1).max(600),
});

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
          summary: z
            .string()
            .min(1)
            .max(200)
            .optional()
            .describe('Short one-liner under the title'),
          highlights: z
            .array(z.string().min(1).max(500))
            .describe('Main highlights for the project'),
          personas: z
            .array(z.string().min(1).max(60))
            .min(1)
            .max(8)
            .optional()
            .describe('Primary audiences (e.g., Maintainers, CLI authors)'),
          valueProps: z
            .array(z.string().min(1).max(200))
            .min(1)
            .max(10)
            .optional()
            .describe('Benefits/value bullets to complement highlights'),
          links: z
            .array(z.string().min(1).max(200))
            .describe('A list of links in Markdown format'),
          related: z
            .array(z.string().min(1).max(200))
            .describe('A list of related links in Markdown format'),
          tags: z
            .enum(Object.keys(readmeTagEnum))
            .describe(
              describeEnum(
                'Activate some code generation for the readme',
                readmeTagEnum
              )
            )
            .optional(),
          images: z
            .object({
              hero: z.string().min(1).max(200).optional(),
              demo: z.string().min(1).max(200).optional(),
            })
            .optional()
            .describe('Custom image paths for hero and demo'),
          cheatsheetFormat: z
            .enum(Object.keys(cheatsheetFormatEnum))
            .describe(
              describeEnum(
                'Format for the cheatsheet examples',
                cheatsheetFormatEnum
              )
            ).optional(),
          cheatsheet: z
            .array(
              z.object({
                title: z
                  .string()
                  .min(1)
                  .max(80)
                  .describe('A title describing the example'),
                example: z
                  .string()
                  .min(1)
                  .max(500)
                  .describe('An example of command that can be run'),
              })
            )
            .min(1)
            .max(40)
            .optional()
            .describe('A cheatsheet with a list of commands'),
          cliExamples: z
            .array(
              z.object({
                title: z.string().min(1).max(80),
                command: z.string().min(1).max(500),
              })
            )
            .min(1)
            .max(40)
            .optional()
            .describe('CLI examples with title + command'),
          apiExamples: z
            .array(
              z.object({
                title: z.string().min(1).max(80),
                lang: z.string().min(1).max(40),
                snippet: z.string().min(1).max(4000),
              })
            )
            .min(1)
            .max(20)
            .optional()
            .describe('Small API examples as code snippets'),
          quickstart: z
            .object({
              intro: z.string().min(1).max(400),
              steps: z.array(z.string().min(1).max(200)).min(1).max(12),
              code: codeSnippet.optional(),
            })
            .optional()
            .describe('Narrative quickstart, steps and optional code'),
          useCases: z.array(useCase).min(1).max(10).optional(),
          configuration: z
            .object({
              env: z.array(envVar).min(1).max(40).optional(),
              files: z.array(configFile).min(1).max(20).optional(),
            })
            .optional(),
          architecture: z
            .object({
              overview: z.array(z.string().min(1).max(200)).min(1).max(20),
              diagram: z.string().min(1).max(200).optional(),
            })
            .optional(),
          faq: z.array(qaItem).min(1).max(20).optional(),
          troubleshooting: z.array(troubleshootItem).min(1).max(20).optional(),
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
        .enum(Object.keys(licenseEnum))
        .describe(describeEnum('License', licenseEnum)),
      author: z
        .object({
          name: z.string().min(1).max(100).describe('The name of the author'),
          url: z.string().url().describe('The URL for the author'),
        })
        .describe('Information about the author'),
      implementation: z
        .object({
          tags: z.array(
            z
              .enum(Object.keys(implementationTagEnum))
              .describe(
                describeEnum(
                  'Trigger some code generation',
                  implementationTagEnum
                )
              )
          ),
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
  })
  .describe('Describe the model for a typical typescript project');
const jsonSchema = zodToJsonSchema(schema, 'typescript-broth');

await fs.writeJson('reserve-schema/ts-broth.schema.json', jsonSchema, {
  spaces: 2,
});
