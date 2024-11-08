/*
  what does this script
  process a file line by line
  each line will parse this format and find the number with the brackets []
  
  lines
  jvm041.out.2024-08-16.14.48.15:2024-08-16 00:22:08,926 INFO - null GetVehicleUnit Service completed in [ 66 ms] (1 try(s))
  jvm041.out.2024-08-16.14.48.15:2024-08-16 00:28:06,122 INFO - null GetVehicleUnit Service completed in [ 38 ms] (1 try(s))
  jvm041.out.2024-08-16.14.48.15:2024-08-16 00:32:45,493 INFO - null GetVehicleUnit Service completed in [ 65 ms] (1 try(s))
  jvm041.out.2024-08-16.14.48.15:2024-08-16 00:32:47,730 INFO - null GetVehicleUnit Service completed in [ 56 ms] (1 try(s))
  etc...

  parsed line
  66
  38
  65
  56
  etc..

*/

const fs = require('fs');

//const filePath = 'test-input.txt';
const filePath = 'vehicleunit-test-input.txt';
let outputFile = "rows-over-3-seconds.log";
let totalRows = 0;
let rowsOver3Seconds = 0;
let rowsMissingMiliSeconds = 0;

function recreateOutputFile(filePath) {
  try {
    // Delete the file if it exists
    fs.unlinkSync(filePath);
    console.log('File deleted successfully.');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      // Handle errors other than "file not found"
      console.error('Error deleting file:', err);
      return;
    }
  }

  // Create a new empty file
  fs.writeFileSync(filePath, '');
  console.log('File created successfully.');
}



function removeMsAndSpaces(str) {
  // Remove spaces using regular expression
  const noSpaces = str.replace(/\s/g, '');

  // Remove "ms" using regular expression
  const result = noSpaces.replace(/ms/g, '');

  return result;
}

function extractText(str) {
  const regex = /\[(.*?)\]/g; // Use the global flag 'g'
  const matches = str.matchAll(regex);

  for (const match of matches) {
  	return parseInt(removeMsAndSpaces(match[1]));
  }

  return "";
}


function processInputLineByLine(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');

    lines.forEach(line => {
      // Process each line as a string here
      totalRows++;
      
      if (extractText(line) > 3000) {
      	rowsOver3Seconds++;
      	fs.appendFileSync(outputFile, extractText(line) + "\n", 'utf8');	
      }

    });
  } catch (err) {
    console.error('Error reading file:', err);
  }
}


recreateOutputFile(outputFile);
processInputLineByLine(filePath);

// Example usage:
//const inputString = "jvm041.out.2024-08-16.14.48.15:2024-08-16 00:22:08,926 INFO - null GetVehicleUnit Service completed in [ 66 ms] (1 try(s))";
//const extracted = extractTextWithinBrackets(inputString);
//console.log(extracted); // Output: ["test", "another test"]

console.log("Report ");
console.log("totalRows: " + totalRows);
console.log("Rows over 3 seconds: " + rowsOver3Seconds);

console.log("End of script.");
