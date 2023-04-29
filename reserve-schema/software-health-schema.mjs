#!/usr/bin/env node
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { describeEnum } from './zod-common.mjs';

/**
 * Run: `npx zx --install reserve-schema/sequence-schema.mjs`
 */

const smallParagraph = z.string().min(1).max(1000);

const conciseParagraph = z.string().min(1).max(600);
const shortName = z.string().min(1).max(40);
const shortTitle = z.string().min(1).max(60);

const automationLevel = {
  manual: 'The engineer performs the task',
  scripted: 'The engineer performs the task following a checklist',
  'semi-automatic':
    'The machine performs the task but may require engineer assistance',
  automatic: 'The machine performs the task repeatedly',
};

const aiLevel = {
  suggestion: 'The AI system suggests different courses of actions',
  driven: 'The AI system performs the task but may require engineer assistance',
  full: 'The AI system performs the task without assistance',
};

const deploymentLevel = {
  local: 'The task is run locally',
  ci: 'The task is run on the continuous integration server',
};

const performanceLevel = {
  days: 'The task takes days to run',
  hours: 'The task takes hours to run',
  minutes: 'The task takes minutes to run',
  seconds: 'The task takes seconds to run',
  'milli-seconds': 'The task takes milli-seconds to run',
};

const score = z.object({
  automation: z
    .enum(Object.keys(automationLevel))
    .describe(describeEnum('Automation level', automationLevel)),
  ai: z.enum(Object.keys(aiLevel)).describe(describeEnum('AI level', aiLevel)),
  deployment: z
    .enum(Object.keys(deploymentLevel))
    .describe(describeEnum('Deployment level', deploymentLevel)),
  performanceLevel: z
    .enum(Object.keys(performanceLevel))
    .describe(describeEnum('Performance level', performanceLevel)),
});

const objective = z.object({
  title: shortTitle.describe('Title for the software health overview'),
  code: z
    .record(z.enum(['readibility', 'refactoring', 'linting']), score)
    .optional()
    .describe('System health of the code base'),
  deps: z
    .record(z.enum(['update', 'audit', 'diagram']), score)
    .optional()
    .describe('Health of the software dependencies'),
  doc: z
    .record(
      z.enum([
        'user-guide',
        'developer-guide',
        'references-api',
        'references-schema',
        'references-glossary',
        'troubleshooting',
        'release-notes',
        'formatting',
        'spell-checking',
        'grammar',
        'proofreading',
        'accessibility-report',
        'security-report',
        'privacy-report',
        'support',
      ]),
      score
    )
    .optional()
    .describe('Health of the documentation'),
  diagram: z
    .record(
      z.enum([
        'architecture',
        'class',
        'sequence',
        'flow',
        'user-journey',
        'mindmap',
        'dependencies',
      ]),
      score
    )
    .optional()
    .describe('Health of the diagrams'),
  test: z
    .record(
      z.enum([
        'unit',
        'regression',
        'functional',
        'integration',
        'end-to-end',
        'platform',
        'browser',
        'device',
        'accessibility',
      ]),
      score
    )
    .optional()
    .describe('Health of the testing'),
  specs: z
    .record(
      z.enum([
        'business-cases',
        'user-stories',
        'cost-benefit-analysis',
        'risk-assessment',
        'roadmap',
        'interviews',
        'surveys',
      ]),
      score
    )
    .optional()
    .describe('Health of the specifications'),
  ux: z
    .record(
      z.enum([
        'user-research',
        'personas',
        'information-architecture',
        'user-flows',
        'wireframes',
        'prototyping',
      ]),
      score
    )
    .optional()
    .describe('Health of the user experience'),
  brainstorming: z
    .record(z.enum(['ideation', 'drawing']), score)
    .optional()
    .describe('Health of the brainstorming capabilities'),
  ops: z
    .record(
      z.enum([
        'deployment',
        'monitoring',
        'rollback',
        'alerting',
        'backup',
        'infrastructure-as-code',
        'diagnosis',
        ,
      ]),
      score
    )
    .optional()
    .describe('Health of operations'),
  architecture: z
    .record(
      z.enum([
        'single-responsibility',
        'well-defined-interface',
        'degrades-gracefully',
        'loosely-coupled',
        'easy-to-understand',
        'clear-source-of-truth',
        'data-retention',
      ]),
      score
    )
    .optional()
    .describe('Health of architecture'),
});

const schema = z
  .object({
    title: shortTitle.describe('Title for the sequence model'),
    description: conciseParagraph.describe('Description '),
    objectives: z.record(shortName, objective),
  })
  .describe('Software Health characteristics');

const jsonSchema = zodToJsonSchema(schema, 'software-health');

await fs.writeJson('reserve-schema/software-health.schema.json', jsonSchema, {
  spaces: 2,
});
