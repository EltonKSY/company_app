exports.toSQLDate = jsDate => {
  const pad = num => ('00' + num).slice(-2);

  let date = new Date(jsDate);
  date = date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate());

  return date;
};
