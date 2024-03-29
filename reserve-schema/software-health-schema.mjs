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
    .optional()
    .describe(describeEnum('Automation level', automationLevel)),
  ai: z
    .enum(Object.keys(aiLevel))
    .optional()
    .describe(describeEnum('AI level', aiLevel)),
  deployment: z
    .enum(Object.keys(deploymentLevel))
    .optional()
    .describe(describeEnum('Deployment level', deploymentLevel)),
  performance: z
    .enum(Object.keys(performanceLevel))
    .optional()
    .describe(describeEnum('Performance level', performanceLevel)),
});

const docName = {
  code: ['readibility', 'refactoring', 'linting', 'generation'],
  deps: ['update', 'audit', 'diagram'],
  doc: [
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
  ],
  diagram: [
    'architecture',
    'class',
    'sequence',
    'flow',
    'user-journey',
    'mindmap',
    'dependencies',
  ],
  test: [
    'unit',
    'regression',
    'functional',
    'integration',
    'end-to-end',
    'platform',
    'browser',
    'device',
    'accessibility',
  ],
  specs: [
    'business-cases',
    'user-stories',
    'cost-benefit-analysis',
    'risk-assessment',
    'roadmap',
    'interviews',
    'surveys',
  ],
  ux: [
    'user-research',
    'personas',
    'information-architecture',
    'user-flows',
    'wireframes',
    'prototyping',
  ],
  brainstorming: ['ideation', 'drawing'],
  ops: [
    'deployment',
    'monitoring',
    'rollback',
    'alerting',
    'backup',
    'infrastructure-as-code',
    'diagnosis',
  ],
  architecture: [
    'single-responsibility',
    'well-defined-interface',
    'degrades-gracefully',
    'loosely-coupled',
    'easy-to-understand',
    'clear-source-of-truth',
    'data-retention',
  ],
};

const schema = z
  .object({
    title: shortTitle.describe('Title for the software health overview'),
    github: z.object({
      name: z.string().min(1).max(60).describe('Github project name'),
      owner: z.string().min(1).max(60).optional().describe('Github owner'),
    }),
    code: z
      .record(z.enum(docName.code), score)
      .optional()
      .describe('System health of the code base'),
    deps: z
      .record(z.enum(docName.deps), score)
      .optional()
      .describe('Health of the software dependencies'),
    doc: z
      .record(z.enum(docName.doc), score)
      .optional()
      .describe('Health of the documentation'),
    diagram: z
      .record(z.enum(docName.diagram), score)
      .optional()
      .describe('Health of the diagrams'),
    test: z
      .record(z.enum(docName.test), score)
      .optional()
      .describe('Health of the testing'),
    specs: z
      .record(z.enum(docName.specs), score)
      .optional()
      .describe('Health of the specifications'),
    ux: z
      .record(z.enum(docName.ux), score)
      .optional()
      .describe('Health of the user experience'),
    brainstorming: z
      .record(z.enum(docName.brainstorming), score)
      .optional()
      .describe('Health of the brainstorming capabilities'),
    ops: z
      .record(z.enum(docName.ops), score)
      .optional()
      .describe('Health of operations'),
    architecture: z
      .record(z.enum(docName.architecture), score)
      .optional()
      .describe('Health of architecture'),
  })
  .strict()
  .describe('Contribution to software health');

const jsonSchema = zodToJsonSchema(schema, 'software-health');

await fs.writeJson('reserve-schema/software-health.schema.json', jsonSchema, {
  spaces: 2,
});
