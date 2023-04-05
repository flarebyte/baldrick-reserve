import { z } from 'zod';

const kindMeta = {
  string: 'Any kind of string',
  'string:url': 'A url',
  'string:path': 'A path relative to the current folder',
  'string:github:project': 'A github project',
  'list:string:url': 'A list of urls',
  'list:string:path': 'A list of paths relative to the current folder',
  'list:string': 'A list of strings',
  'code:json': 'An JSON payload',
  'code:yaml': 'An YAML payload',
  'code:javascript': 'An Javascript payload',
  'code:typescript': 'An Typescript payload',
  'code:mermaid': 'A Mermaid payload',
  'number:positive': 'A positive number',
  'integer:positive': 'A positive integer',
  'true/false': 'A boolean value',
  'yes/no': 'A boolean value',
  'yes/no/maybe': 'A boolean value and maybe',
  '5-point-scale':
    'Strongly _, Somewhat _, Neither _ nor _, Somewhat _, Strongly _',
  '7-point-scale':
    'Always, Strongly _, Somewhat _, Neither _ nor _, Somewhat _, Strongly _, Never',
  currency: 'An amount of money',
  'number:percentage': 'A percentage',
};

export const describeEnum = (intro, objectValue) => {
  const description = [`${intro} with either:`];
  for (const [name, title] of Object.entries(objectValue)) {
    description.push(`${name}: ${title}`);
  }
  return description.join('\n');
};

export const dataKind = z
  .enum(Object.keys(kindMeta))
  .describe(describeEnum('Kind of the data', kindMeta));
