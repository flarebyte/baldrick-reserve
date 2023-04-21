#!/usr/bin/env zx
$.verbose = false;

const startYear = parseInt(argv.start || '2020');
const endYear = parseInt(argv.end || '2023');
const companyCriteria = argv.company;
const byYearFilename = `contributions-by-year-${startYear}-${endYear}.tsv`;
const allYearFilename = `contributions-all-${startYear}-${endYear}.tsv`;

const contributionGraphQL = (year) =>
  `
{
    viewer {
      login
      contributionsCollection(from: "${year}-01-01T01:01:01Z") {
        commitContributionsByRepository {
          contributions {
            totalCount
          }
          repository {
            description
            name
            primaryLanguage {
              name
            }
            owner {
              login
            }
          }
        }
      }
    }
  }
`;

const pickContributionRow = (year) => (commitContrib) => ({
  contribution: commitContrib?.contributions?.totalCount,
  repository: commitContrib?.repository?.name,
  description: commitContrib?.repository?.description,
  language: commitContrib?.repository?.primaryLanguage?.name,
  company: commitContrib?.repository?.owner?.login,
  year,
});

const getContributionsForYear = async (year) => {
  const content = await $`gh api graphql -f query=${contributionGraphQL(year)}`;
  const contributionPayload = JSON.parse(content);
  const contributionsCollection =
    contributionPayload.data.viewer.contributionsCollection
      .commitContributionsByRepository;
  const contributions = contributionsCollection.map(pickContributionRow(year));
  return contributions;
};

const rangeInt = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

const sortedByRepository = (a, b) => {
  if (a.repository > b.repository) return 1;
  if (a.repository < b.repository) return -1;
  return 0;
};

const byCompany = (row) =>
  typeof companyCriteria === 'undefined'
    ? true
    : row.company === companyCriteria;

const contributionsByRangeYear = async () => {
  let result = [];
  for (const year of rangeInt(startYear, endYear)) {
    const thisYearContrib = await getContributionsForYear(year);
    result = [...result, ...thisYearContrib];
  }
  return result.filter(byCompany).sort(sortedByRepository);
};

const contributionsByYear = await contributionsByRangeYear();

const contributionsByYearToTsv = () => {
  let outContent =
    'repository\tlanguage\tcontribution\tdescription\tcompany\tyear\n';
  for (const row of contributionsByYear) {
    const { repository, description, language, contribution, company, year } =
      row;
    outContent += `${repository}\t${language}\t${contribution}\t${description}\t${company}\t${year}\n`;
  }
  return outContent;
};

const mergeContributions = () => {
  let merge = {};
  for (const row of contributionsByYear) {
    const previousContrib =
      typeof merge[row.repository] === 'undefined'
        ? 0
        : merge[row.repository].contribution;
    merge[row.repository] = {
      repository: row.repository,
      description: row.description,
      language: row.language,
      company: row.company,
      contribution: previousContrib + row.contribution,
    };
  }
  return Object.values(merge).sort(sortedByRepository);
};

const contributionsAnyYear = mergeContributions();

const contributionsAnyYearToTsv = () => {
  let outContent = 'repository\tlanguage\tcontribution\tdescription\tcompany\n';
  for (const row of contributionsAnyYear) {
    const { repository, description, language, contribution, company } = row;
    outContent += `${repository}\t${language}\t${contribution}\t${description}\t${company}\n`;
  }
  return outContent;
};

await fs.writeFile(byYearFilename, contributionsByYearToTsv(), {
  encoding: 'utf-8',
});

console.log(`Done: See ${byYearFilename}, ${contributionsByYear.length} rows`);

await fs.writeFile(allYearFilename, contributionsAnyYearToTsv(), {
  encoding: 'utf-8',
});

console.log(
  `Done: See ${allYearFilename}, ${contributionsAnyYear.length} rows`
);
