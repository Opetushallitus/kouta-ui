import { getKoulutuksenAlkamisvuosiOptions } from './getKoulutuksenAlkamisvuosiOptions';

test('getKoulutuksenAlkamisvuosiOptions', () => {
  jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01'));

  expect(getKoulutuksenAlkamisvuosiOptions()).toEqual([
    {
      label: '2018',
      value: '2018',
    },
    {
      label: '2019',
      value: '2019',
    },
    {
      label: '2020',
      value: '2020',
    },
    {
      label: '2021',
      value: '2021',
    },
    {
      label: '2022',
      value: '2022',
    },
  ]);
  jest.useRealTimers();
});
