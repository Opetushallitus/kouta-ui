import React from 'react';

import { renderWithTheme, screen, fireEvent, within } from '#/src/testUtils';

import { OsaamisalatInput } from './OsaamisalatInput';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: str => str,
  }),
}));

test('onChange works right', () => {
  const osaamisalatValue = ['osaamisala_1', 'osaamisala_2', 'osaamisala_3'];

  const ePeruste = {
    nimi: 'eperuste nimi',
    osaamisalat: [
      { nimi: { fi: 'osaamisala 1' }, uri: 'osaamisala_1' },
      { nimi: { fi: 'osaamisala 2' }, uri: 'osaamisala_2' },
    ],
  };

  const osaamisalatKoodistoData = [
    {
      koodiUri: 'osaamisala_1',
      versio: 1,
      metadata: [
        {
          kieli: 'FI',
          nimi: 'osaamisala 1',
        },
      ],
    },
    {
      koodiUri: 'osaamisala_2',
      versio: 1,
      metadata: [
        {
          kieli: 'FI',
          nimi: 'osaamisala 2',
        },
      ],
    },
    {
      koodiUri: 'osaamisala_3',
      versio: 1,
      metadata: [
        {
          kieli: 'FI',
          nimi: 'osaamisala 3',
        },
      ],
    },
  ];

  const onChange = jest.fn();

  renderWithTheme(
    <OsaamisalatInput
      value={osaamisalatValue}
      language="fi"
      ePeruste={ePeruste}
      osaamisalatKoodistoData={osaamisalatKoodistoData}
      onChange={onChange}
    />
  );

  const validOsaamisalatInput = screen.getByLabelText(
    'toteutuslomake.valitseOsaamisalat'
  );

  const osaamisala1Checkbox = within(validOsaamisalatInput).getByRole(
    'checkbox',
    {
      name: 'osaamisala 1',
    }
  );

  const invalidOsaamisalatInput = screen.getByLabelText(
    'toteutuslomake.virheellinenOsaamisalaValinta'
  );

  const osaamisala3Checkbox = within(invalidOsaamisalatInput).getByRole(
    'checkbox',
    {
      name: 'osaamisala 3',
    }
  );

  fireEvent.click(osaamisala1Checkbox);
  expect(onChange).toHaveBeenCalledWith(['osaamisala_2', 'osaamisala_3']);

  fireEvent.click(osaamisala3Checkbox);
  expect(onChange).toHaveBeenCalledWith(['osaamisala_1', 'osaamisala_2']);
});
