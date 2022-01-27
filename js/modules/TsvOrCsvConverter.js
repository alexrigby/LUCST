//CONVERTS JSON OBJECTS TO EITHER TSV OR CSV FORMAT

// tsv:  TsvOrCsvConverter(data, '\t')
//csv:    TsvOrCsvConverter(data, ',')


export function TsvOrCsvConverter(data, seperator) {
    // Convert dataset to TSV and print
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(fieldName => row[fieldName]).join(seperator))
    ].join('\r\n');
    return csv;
  }
  
export default { 
  TsvOrCsvConverter
}