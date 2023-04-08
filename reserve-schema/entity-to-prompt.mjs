#!/usr/bin/env node

const entityFilename = argv.filename;

const entityContent = await fs.readFile(entityFilename, {
  encoding: 'utf-8',
});
const jsonEntity = YAML.parse(entityContent);

const jsonToText = (entity) => {
  let text = "";
  
  text += `The entity "${entity.name}" `;
  
  text += `represents a ${entity.title}. `;
  
  text += `It could be described as ${entity.description}. `;
  
  text += `It belongs to a ${entity.ownership.join(", ")}. `;
  
  text += `The fields have the following characteristics: ${entity.fields.join(", ")}. `;
  
  text += `It is usually in a ${entity.format} format. `;
  
  text += `Some care should be taken about the following privacy concerns: ${entity.privacy.join(", ")} data. `;
  
  text += `The data should be kept for a ${entity.retentionPeriod}. `;
  
  text += `In average the data, ${entity.createFrequency} is likely to be created, `;
  
  text += `${entity.readFrequency} is likely to be read, `;
  
  text += `${entity.updateFrequency} is likely to be updated, `;
  
  text += `${entity.deleteFrequency} is likely to be deleted,  `;
  
  text += `${entity.backupFrequency} is likely to be backup. `;
  
  text += `The order of magnitude for the size of the data is ${entity.dataSize}. `;
  
  text += `The data should be validated in the following manners: ${entity.validation.join(", ")}. `;
  
  const relationships = entity.relationhships.map((relationship) => {
    return `- ${relationship.title}`;
  });
  
  text += `\nRelationships:\n${relationships.join("\n")}\n`;
  
  const mustHaves = entity.mustHave.map((mustHave) => {
    return `- ${mustHave}`;
  });
  
  text += `Must-haves:\n${mustHaves.join("\n")}\n`;
  
  return text;
};

console.log(jsonToText(jsonEntity))
