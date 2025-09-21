#!/usr/bin/env zx
// Usage: npx zx --install script/service-cost.mjs -- --filename <cost.yaml>
// Purpose: Read a service cost YAML and print a quick budget view with unicode
//          bars and GBP normalization to stdout.
// Example:
//   npx zx --install script/service-cost.mjs -- --filename data/cost.yaml
// Overview: Parses YAML, normalizes currency, renders tiny bar charts, and logs
//           results; uses zx globals (argv, fs, YAML).

if (!argv.filename){
    throw new Error('I was expecting --filename')
  }
  const serviceCostFileName = argv.filename;
  
  const budgetUnitInPound = 20;
  
  const content = await fs.readFile(serviceCostFileName, { encoding: "utf8" });
  
  const serviceCostAll = YAML.parse(content);
  
  const toPound = (amount, currency) => {
    if (currency === "gbp") {
      return amount;
    }
    if (currency === "dollar") {
      return amount * 0.8;
    }
    return -1;
  };
  const numberToBar = (value) => {
    switch (value) {
      case 2:
        return "▁";
      case 3:
        return "▂";
      case 4:
        return "▃";
      case 5:
        return "▄";
      case 6:
        return "▅";
      case 7:
        return "▆";
      case 8:
        return "▇";
      case 9:
        return "█";
      default:
        return "";
    }
  };
  
  const getTitleIcon = (tags) => {
    if (tags.includes("human")) {
      return "🧍";
    }
    if (tags.includes("database")) {
      return "🧮";
    }
    if (tags.includes("ledger")) {
      return "💵";
    }
    if (tags.includes("webservice")) {
      return "🤖";
    }
    return "";
  };
  
  const { costs, currency: defaultCurrency } = serviceCostAll;
  
  const asHumanNumber = (value) => {
    const readable = value.toFixed(1).toLocaleString("en-US");
    const magnitude = readable.length - 2;
    const bar = numberToBar(magnitude);
    return `${bar} ${readable}`;
  };
  
  const toServiceCost = (serviceCost) => {
    const { title, description, amount, tags, unit, currency } = serviceCost;
    const poundCost = toPound(amount, currency || defaultCurrency);
    const ratio = asHumanNumber(budgetUnitInPound / poundCost);
    const ratioDays = unit.includes("hour")
      ? asHumanNumber(budgetUnitInPound / (poundCost * 24))
      : -1;
    const ratioDaysDescription = unit.includes("hour")
      ? `${ratioDays} x ${unit.replace("hour", "day")}`
      : "";
    const titleIcon = getTitleIcon(tags);
    const row = ` | ${title} ${titleIcon}| ${ratio} x ${unit} | ${ratioDaysDescription} |`;
    return row;
  };
  
  const costRows = Object.values(costs).map(toServiceCost).sort().join("\n");
  
  const mdReport = `
  # 2023 Service cost overview
  
  | Title | Service | Other       |
  | ------|---------|-------------|
  ${costRows}
  `;
  
  const markdownFilename = path.join(
    path.dirname(serviceCostFileName),
    path.basename(serviceCostFileName).replace(".service-cost.yaml", "").toUpperCase()+'.md'
  );
  
  await fs.writeFile(markdownFilename, mdReport, { encoding: "utf8" });
  
