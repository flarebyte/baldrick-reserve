import { z } from 'zod';

export const describeEnum = (intro, objectValue) => {
  const description = [`${intro} with either:`];
  for (const [name, title] of Object.entries(objectValue)) {
    description.push(`${name}: ${title}`);
  }
  return description.join('\n');
};
