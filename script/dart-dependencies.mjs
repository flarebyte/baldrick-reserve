#!/usr/bin/env zx
// Usage: npx zx --install script/dart-dependencies.mjs
// Purpose: Summarize Dart pubspec dependencies and flag which are recognized in
//          a curated registry; outputs to stdout or can be extended to MD.
// Example:
//   npx zx --install script/dart-dependencies.mjs
// Overview: Parses pubspec.yaml via zx YAML, compares deps against a registry,
//           and reports gaps.

const pubspecFile = await fs.readFile('pubspec.yaml', { encoding: 'utf8' });
const pubspec = YAML.parse(pubspecFile);

const registeredDependencies = {
    lints: 'The Dart linter is a static analyzer for identifying possible problems in your Dart source code',
    test: 'Provides a standard way of writing and running tests in Dart'
};

const registeredDependenciesKeys = Object.keys(registeredDependencies);

const dependencies = pubspec.dependencies
  ? Object.keys(pubspec.dependencies).sort()
  : [];

const devDependencies = pubspec.dev_dependencies
  ? Object.keys(pubspec.dev_dependencies).sort()
  : [];



const isRegistered = (name) => registeredDependenciesKeys.includes(name);
const isNotRegistered = (name) => !registeredDependenciesKeys.includes(name);

const notRegisteredDependencies = [
  ...dependencies,
  devDependencies,
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

const dependenciesSection =
  dependencies.length > 0
    ? `${tableHeader}\n${dependenciesTable}`
    : '🎉 No dependency';

const devDependenciesSection =
  devDependencies.length > 0
    ? `${tableHeader}\n${devDependenciesTable}`
    : '🎉 No dependency';

const summary = `# Dependencies overview

## Production dependencies

${dependenciesSection}

## Development dependencies

${devDependenciesSection}

`;

await fs.writeFile('DEPENDENCIES.md', summary, { encoding: 'utf8' });
