import { ensureString, ensureNumber } from '../types'

const TAB_CHAR = '\t'
const SPACE_CHAR = ' '

const stringGenerator = (string = ' ', iterations =  1) => {
  const ensuredString = ensureString(string)
  const ensuredIterations = ensureNumber(iterations)
  const numIterations = ensuredIterations > 0 ? ensuredIterations : 1

  return new Array(numIterations).fill(ensuredString).join('')
}
const stringReplaceWithSpaces = (string, search, spaces) => {
  const ensuredString = ensureString(string)
  const ensuredSpaces = ensureNumber(spaces) || 1
  const generatedSpaces = stringGenerator(SPACE_CHAR, ensuredSpaces)

  return ensuredString.replace(search, generatedSpaces)
}

const csvToMarkdown = props => {
  const {
    csvData = '',
    includesHeader = true,
    spacer = TAB_CHAR,
    tabSpaces = 4
  } = props

  const ensuredCsvData = (spacer !== TAB_CHAR)
    ? stringReplaceWithSpaces(csvData, new RegExp(TAB_CHAR, 'g'), tabSpaces)
    : ensureString(csvData)

  const rows = ensuredCsvData.split(/\r?\n/).map(row => {
    const columnPattern = new RegExp(spacer + '(?![^"]*"\\B)')

    return row.split(columnPattern)
  })
}


/*
export function csvToMarkdown(csvContent: string, delimiter: string = "\t", hasHeader: boolean = false): string {
	if (delimiter != "\t") {
		csvContent = csvContent.replace(/\t/g, "    ");
	}

	const columns = csvContent.split(/\r?\n/);

	const tabularData: string[][] = [];
	const maxRowLen: number[] = [];

	columns.forEach((e, i) => {
		if (typeof tabularData[i] == "undefined") {
			tabularData[i] = [];
		}
		const regex = new RegExp(delimiter + '(?![^"]*"\\B)');
		const row = e.split(regex);
		row.forEach((ee, ii) => {
			if (typeof maxRowLen[ii] == "undefined") {
				maxRowLen[ii] = 0;
			}

			// escape pipes and backslashes
			ee = ee.replace(/(\||\\)/g, "\\$1");

			maxRowLen[ii] = Math.max(maxRowLen[ii], ee.length);
			tabularData[i][ii] = ee;
		});
	});

	let headerOutput = "";
	let seperatorOutput = "";

	maxRowLen.forEach((len) => {
		const sizer = Array(len + 1 + 2);

		seperatorOutput += "|" + sizer.join("-");
		headerOutput += "|" + sizer.join(" ");
	});

	headerOutput += "| \n";
	seperatorOutput += "| \n";

	if (hasHeader) {
		headerOutput = "";
	}

	let rowOutput = "";
	tabularData.forEach((col, i) => {
		maxRowLen.forEach((len, y) => {
			const row = typeof col[y] == "undefined" ? "" : col[y];
			const spacing = Array((len - row.length) + 1).join(" ");
			const out = `| ${row}${spacing} `;
			if (hasHeader && i === 0) {
				headerOutput += out;
			} else {
				rowOutput += out;
			}
		});

		if (hasHeader && i === 0) {
			headerOutput += "| \n";
		} else {
			rowOutput += "| \n";
		}
	});

	return `${headerOutput}${seperatorOutput}${rowOutput}`;
}

if (typeof module != "undefined") {
	module.exports = csvToMarkdown;
}
 */