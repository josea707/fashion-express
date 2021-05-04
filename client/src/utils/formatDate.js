const getMonth = (monthNumber) => {
  switch (monthNumber) {
    case 1:
      return 'January';
    case 2:
      return 'February';
    case 3:
      return 'March';

    case 4:
      return 'April';

    case 5:
      return 'May';

    case 6:
      return 'June';

    case 7:
      return 'July';

    case 8:
      return 'August';

    case 9:
      return 'September';
    case 10:
      return 'October';
    case 11:
      return 'November';

    case 12:
      return 'December';

    default:
      return 'Invalid month';
  }
};

const formatDate = (date) => {
  const dt = new Date(date);
  return (
    getMonth(dt.getMonth() + 1) + ' ' + dt.getDate() + ', ' + dt.getFullYear()
  );
};

const formatDateAndTime = (date) => {
  const dt = new Date(date);
  return (
    formatDate(date) +
    ' ' +
    dt.getHours() +
    ':' +
    dt.getMinutes() +
    ':' +
    dt.getSeconds() +
    (dt.getHours >= 12 ? ' PM' : ' AM')
  );
};

export { formatDate, formatDateAndTime };
