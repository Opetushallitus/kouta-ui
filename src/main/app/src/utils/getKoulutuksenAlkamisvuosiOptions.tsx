const getKoulutuksenAlkamisvuosiOptions = () => {
  const thisYear = new Date().getFullYear();
  const yearOptions = [thisYear];

  let numOfYearsBeforeAndAfterThisYear = 2;
  do {
    yearOptions.push(thisYear + numOfYearsBeforeAndAfterThisYear);
    yearOptions.push(thisYear - numOfYearsBeforeAndAfterThisYear);
    numOfYearsBeforeAndAfterThisYear = numOfYearsBeforeAndAfterThisYear - 1;
  } while (numOfYearsBeforeAndAfterThisYear > 0);

  return yearOptions.sort().map(year => {
    const yearStr = year.toString();
    return {
      label: yearStr,
      value: yearStr,
    };
  });
};

export default getKoulutuksenAlkamisvuosiOptions;
