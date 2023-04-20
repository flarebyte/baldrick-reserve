#!/usr/bin/env node

/**
 * Aggregate github contributions over the years to facilitate update of cv
 * npx zx merge-contrib.mjs --tsvfile work-contrib.tsv --out aggregate-work-contrib.tsv
 * Input tsv: contributions repository repository/description Language Company Year
 * Output tsv: repository language contribution description
 */

const tsvFilename = argv.tsvfile || 'in.tsv';

const outTsvFilename = argv.out || "out.tsv";

const tsvContent = await fs.readFile(tsvFilename, {
  encoding: "utf-8",
});

const parseContribRow = (line) => {
  const [contribution, repository, description, language, company, year] =
    line.split("\t");
  return {
    contribution: parseInt(contribution),
    repository,
    description,
    language,
  };
};

const contribRows = tsvContent
  .split("\n")
  .filter((line) => line.length > 0)
  .slice(1)
  .map(parseContribRow);

const merge = {};
for (const row of contribRows) {
  const previousContrib =
    typeof merge[row.repository] === "undefined"
      ? 0
      : merge[row.repository].contribution;
  merge[row.repository] = {
    repository: row.repository,
    description: row.description,
    language: row.language,
    contribution: previousContrib + row.contribution,
  };
}

const sortedByRepository = (a, b) => {
  if (a.repository > b.repository) return 1;
  if (a.repository < b.repository) return -1;
  return 0;
};

let outContent = "repository\tlanguage\tcontribution\tdescription\n";

const sortedRepo = Object.values(merge).sort(sortedByRepository);

for (const row of sortedRepo) {
  const { repository, description, language, contribution } = row;
  outContent += `${repository}\t${language}\t${contribution}\t${description}\n`;
}

await fs.writeFile(outTsvFilename, outContent, {
  encoding: "utf-8",
});

console.log(`Done: ${outContent.split("\n").length} rows`)