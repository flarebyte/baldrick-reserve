#!/usr/bin/env node

const packageJson = await fs.readJson('package.json');

const registeredDependencies = {
  zod: 'Zod is a TypeScript-first schema declaration and validation library',
  '@types/node': 'Types for the node.js platform',
  'baldrick-zest-engine': 'Run tests declaratively',
  'baldrick-zest-mess': 'Useful utilities for the zest unit test framework',
  'ts-node': 'TypeScript execution environment and REPL for node.js',
  typescript: 'Language for application scale JavaScript development',
  xo: 'JavaScript/TypeScript linter (ESLint wrapper) with great defaults',
  chalk: 'Terminal string styling done right',
  commander: 'Complete solution for node.js command-line programs',
  'dot-prop':
    'Get, set, or delete a property from a nested object using a dot path',
  enquirer: 'Stylish, intuitive and user-friendly prompt system',
  execa: 'Process execution for humans',
  handlebars:
    'Handlebars provides the power necessary to let you build semantic templates effectively with no frustration',
  'json-mask':
    'Tiny language and engine for selecting specific parts of a JS object, hiding the rest',
  listr2:
    'Terminal task list reborn! Create beautiful CLI interfaces via easy and logical to implement task lists that feel alive and interactive',
  papaparse:
    'Fast and powerful CSV parser for the browser that supports web workers and streaming large files. Converts CSV to JSON and JSON to CSV',
  winston: 'A logger for just about everything',
  yaml: 'JavaScript parser and stringifier for YAML',
};

const registeredDependenciesKeys = Object.keys(registeredDependencies);

const dependencies = packageJson.dependencies
  ? Object.keys(packageJson.dependencies).sort()
  : [];

const devDependencies = packageJson.devDependencies
  ? Object.keys(packageJson.devDependencies).sort()
  : [];

const peerDependencies = packageJson.peerDependencies
  ? Object.keys(packageJson.peerDependencies).sort()
  : [];

const isRegistered = (name) => registeredDependenciesKeys.includes(name);
const isNotRegistered = (name) => !registeredDependenciesKeys.includes(name);

const notRegisteredDependencies = [
  ...dependencies,
  devDependencies,
  ...peerDependencies,
].filter(isNotRegistered);

let unregisteredDependencies = {};
for (const name of notRegisteredDependencies) {
  const description = await $`npm info ${name} description`;
  unregisteredDependencies[name] = `${description}`.trim();
}

const tableHeader = [
  '|npm name|description|registered|',
  '|-----|------|----|',
].join('\n');

const nameToRow = (name) =>
  isRegistered(name)
    ? `|${name}|${registeredDependencies[name]}|✅ yes|`
    : `|${name}|${unregisteredDependencies[name]}|❗ no|`;

const dependenciesTable = dependencies.map(nameToRow).join('\n');
const devDependenciesTable = devDependencies.map(nameToRow).join('\n');
const peerDependenciesTable = peerDependencies.map(nameToRow).join('\n');

const dependenciesSection =
  dependencies.length > 0
    ? `${tableHeader}\n${dependenciesTable}`
    : '🎉 No dependency';

const devDependenciesSection =
  devDependencies.length > 0
    ? `${tableHeader}\n${devDependenciesTable}`
    : '🎉 No dependency';

const peerDependenciesSection =
  peerDependencies.length > 0
    ? `${tableHeader}\n${peerDependenciesTable}`
    : '🎉 No dependency';

const summary = `# Dependencies overview

## Production dependencies

${dependenciesSection}

## Development dependencies

${devDependenciesSection}

## Peer dependencies

${peerDependenciesSection}
`;

await fs.writeFile('DEPENDENCIES.md', summary, { encoding: 'utf8' });
