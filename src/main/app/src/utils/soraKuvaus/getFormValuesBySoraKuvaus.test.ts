import getFormValuesBySoraKuvaus from '#/src/utils/soraKuvaus/getFormValuesBySoraKuvaus';

test('getFormValuesBySoraKuvaus returns correct form values given sora-kuvaus', () => {
  const values = getFormValuesBySoraKuvaus({
    externalId: 'ext1',
    tila: 'tallennettu',
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
      koulutusalaKoodiUri:
        'kansallinenkoulutusluokitus2016koulutusalataso2_073#1',
      koulutusKoodiUrit: ['koulutus_754101#7'],
    },
    julkinen: true,
    koulutustyyppi: 'amm',
  });

  expect(values).toMatchSnapshot();
});
