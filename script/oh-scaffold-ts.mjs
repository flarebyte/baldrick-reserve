#!/usr/bin/env zx

await $`npx baldrick-whisker@latest object baldrick-broth.yaml github:flarebyte:baldrick-reserve:data/ts/baldrick-broth.yaml`;
const target = "lib";
const projectName = path.basename(__dirname);

const brothModel = {
  project: {
    title: "todo",
    description: "todo",
    version: "0.1.0",
    keywords: ["todo"],
  },
  readme: {
    highlights: ["todo"],
    links: ["[Npm dependencies](DEPENDENCIES.md)"],
  },
  github: {
    account: "flarebyte",
    name: projectName,
  },
  copyright: {
    holder: "Flarebyte.com",
    startYear: new Date().getFullYear(),
  },
  license: "MIT",
  author: {
    name: "Olivier Huin",
    url: "https://github.com/olih",
  },
  implementation: {
    tags: [target],
  },
  "workflow-version": "0.3.0",
};

const brothContent = await fs.readFile("baldrick-broth.yaml", {
  encoding: "utf8",
});
const brothObj = YAML.parse(brothContent);
brothObj.model = brothModel;

const newBrothContent = YAML.stringify(brothObj);

await fs.writeFile("baldrick-broth.yaml", newBrothContent, {
  encoding: "utf8",
});

const packageJSON = {
  name: projectName,
  description: projectName,
  version: "0.1.0",
  author: {
    name: "Olivier Huin",
    url: "https://github.com/olih",
  },
  keywords: [],
  license: "MIT",
  scripts: {},
  dependencies: {},
  devDependencies: {},
  peerDependencies: {},
};

await fs.writeJson("package.json", packageJSON);
await $`mkdir -p src`;
await $`mkdir -p test`;

const noTestYet = `
import { test } from 'node:test';

test('no test yet', () => {
  console.log('no test yet');
});
`;
await fs.writeFile("test/index.test.ts", noTestYet, {
  encoding: "utf8",
});

await fs.writeFile("src/index.ts", 'console.log("Hi")', {
  encoding: "utf8",
});

await $`yarn add typescript ts-node baldrick-zest-engine baldrick-zest-mess xo --dev `;

echo('Basic skeleton is ready. You should run: broth scaffold norm')