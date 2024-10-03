const { Command } = require('commander');
const fs = require('fs');

const program = new Command();

program
  .requiredOption('-i, --input <path>', 'шлях до файлу для читання')
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат в консоль');

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

let data;
try {
  data = fs.readFileSync(options.input, 'utf8');
} catch (err) {
  console.error('Error reading file:', err);
  process.exit(1);
}

let parsedData;
try {
  parsedData = JSON.parse(data);
} catch (err) {
  console.error('Error parsing JSON:', err);
  process.exit(1);
}

const selectedCategories = ['Доходи, усього', 'Витрати, усього'];
const results = [];

parsedData.forEach(item => {
  if (item.txt && item.value) {
    const category = item.txt;
    const value = item.value;

    if (selectedCategories.includes(category)) {
      results.push(`${category}: ${value}`);
    }
  }
});

if (results.length === 0) {
  process.exit(0);
}

const outputResult = (result) => {
  if (options.output) {
    try {
      fs.writeFileSync(options.output, result);
      console.log(`Result has been written to ${options.output}`);
    } catch (err) {
      console.error('Error writing to file:', err);
      process.exit(1);
    }
  }
  
  if (options.display) {
    console.log(result);
  }
};

const finalResult = results.join('\n');

if (options.output || options.display) {
  outputResult(finalResult);
}