import getFormValuesBySoraKuvaus from '../getFormValuesBySoraKuvaus';

test('getFormValuesBySoraKuvaus returns correct form values given sora-kuvaus', () => {
  const values = getFormValuesBySoraKuvaus({
    kieliversiot: ['fi', 'sv'],
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
    metadata: {
      kuvaus: {
        fi: '<b>Kuvaus fi</b>',
        sv: '<i>Kuvaus sv</i>',
      },
    },
    julkinen: true,
    koulutustyyppi: 'amm',
  });

  expect(values).toMatchSnapshot();
});
