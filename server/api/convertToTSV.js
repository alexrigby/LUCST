
module.exports = (data) => {
    // Convert dataset to TSV and print
    const headers = Object.keys(data[0]);
    const tsv = [
      headers.join("\t"),
      ...data.map((row) => headers.map((fieldName) => row[fieldName]).join("\t")),
    ].join("\r\n");
  
    return tsv;
  };