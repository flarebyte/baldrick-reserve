#!/usr/bin/env zx
// Usage: npx zx --install script/gh-find-repos-with-file.mjs -- --owner flarebyte --path package.json [--archived] [--format json|text]
// Purpose: List all GitHub repositories for an owner (org or user) that contain
//          a file at a given path (e.g., package.json) using the GitHub CLI.
// Examples:
//   - Basic:   npx zx --install script/gh-find-repos-with-file.mjs -- --owner flarebyte --path package.json
//   - JSON:    npx zx --install script/gh-find-repos-with-file.mjs -- --owner flarebyte --path .github/workflows/main.yml --format json
// Overview: Detects owner type (org/user), fetches all repos via gh api with
//           pagination, filters archived by default, then probes each repo’s
//           contents endpoint for the specified path. Outputs matching repos.

$.verbose = false;

const owner = argv.owner || 'flarebyte';
const rawPath = argv.path;
const includeArchived = Boolean(argv.archived || false);
const format = (argv.format || 'text').toLowerCase();

if (!rawPath) {
  console.error('Error: --path is required (e.g., package.json or dir/file)');
  process.exit(1);
}

// Normalize leading slash
const pathAtRepo = `${rawPath}`.replace(/^\/+/, '');

const isOrg = async (name) => {
  try {
    await $`gh api orgs/${name} > /dev/null`;
    return true;
  } catch {
    return false;
  }
};

const isUser = async (name) => {
  try {
    await $`gh api users/${name} > /dev/null`;
    return true;
  } catch {
    return false;
  }
};

const ownerIsOrg = await isOrg(owner);
const ownerIsUser = !ownerIsOrg && (await isUser(owner));
if (!ownerIsOrg && !ownerIsUser) {
  console.error(`Error: Owner ${owner} not found as org or user.`);
  process.exit(1);
}

const baseListEndpoint = ownerIsOrg ? `orgs/${owner}/repos` : `users/${owner}/repos`;

// name, default_branch, archived
const reposTsv = await $`gh api --paginate ${baseListEndpoint} --jq '.[] | [.name, .default_branch, .archived] | @tsv'`;
const repos = `${reposTsv}`
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [name, default_branch, archivedStr] = line.split('\t');
    const archived = archivedStr === 'true';
    return { name, default_branch, archived };
  })
  .filter((r) => includeArchived || !r.archived);

const matches = [];
for (const repo of repos) {
  try {
    await $`gh api repos/${owner}/${repo.name}/contents/${pathAtRepo} > /dev/null`;
    const url = `https://github.com/${owner}/${repo.name}/blob/${repo.default_branch}/${pathAtRepo}`;
    matches.push({ owner, name: repo.name, default_branch: repo.default_branch, path: pathAtRepo, url });
  } catch {
    // 404s are expected; ignore
  }
}

if (format === 'json') {
  console.log(JSON.stringify(matches, null, 2));
} else {
  console.log(`# Repositories under ${owner} containing '${pathAtRepo}'`);
  for (const m of matches) {
    console.log(`${m.owner}/${m.name}\t${m.url}`);
  }
}

