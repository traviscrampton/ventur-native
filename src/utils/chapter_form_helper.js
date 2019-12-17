const MONTHS = [
  'January',
  'Feburary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const generateReadableDate = date => {
  const month = MONTHS[date.getMonth()];
  const day = ` ${date.getDate()}, `;
  const year = date.getFullYear();

  return month + day + year;
};
