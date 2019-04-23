import { getHakuByValues, getValuesByHaku } from '../utils';

test('getHakuByValues returns correct haku given form values', () => {
  const haku = getHakuByValues({
    nimi: {
      nimi: {
        fi: 'Nimi',
        sv: 'Namn',
      },
    },
    kieliversiot: {
      languages: ['fi', 'sv'],
    },
    aikataulut: {
      kausi: 'alkamiskausi_1#1',
      vuosi: { value: '2020' },
      hakuaika: [
        {
          alkaa: '2019-04-16T08:44',
          paattyy: '2019-04-18T08:44',
        },
        {
          alkaa: '2019-06-16T08:44',
          paattyy: '2019-06-18T08:44',
        },
      ],
      aikataulu: [
        {
          alkaa: '2019-08-16T08:44',
          paattyy: '2019-08-18T08:44',
        },
        {
          alkaa: '2019-09-16T08:44',
          paattyy: '2019-09-18T08:44',
        },
      ],
      lisaamisenTakaraja: '2019-09-16T08:44',
      muokkauksenTakaraja: '2019-10-16T08:44',
      ajastettuJulkaisu: '2019-11-16T08:44',
    },
    hakutapa: {
      tapa: 'hakutapa_1#1',
    },
    kohdejoukko: {
      kohde: 'kohde_1#1',
    },
    hakulomake: {
      lomaketyyppi: 'tyyppi',
    },
    yhteystiedot: {
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
      titteli: { fi: 'Fi titteli', sv: 'Sv titteli' },
      email: { fi: 'Fi sähköposti', sv: 'Sv sähköposti' },
      puhelin: { fi: 'Fi puhelinnumero', sv: 'Sv puhelinnumero' },
    },
  });

  expect(haku).toMatchSnapshot();
});

test('getValuesByHaku returns correct form values given haku', () => {
  const values = getValuesByHaku({
    alkamiskausiKoodiUri: 'kausi_1#1',
    kielivalinta: ['fi', 'sv'],
    hakutapaKoodiUri: 'hakutapa_1#1',
    hakuajat: [{ alkaa: '2019-03-29T12:28', paattyy: '2019-09-29T12:30' }],
    hakukohteenLiittamisenTakaraja: '2019-03-29T12:28',
    nimi: {
      fi: 'Fi nimi',
      sv: 'Sv nimi',
    },
    kohdejoukkoKoodiUri: 'kohdejoukko_1#1',
    kohdejoukonTarkenneKoodiUri: 'tarkenne_1#1',
    hakulomaketyyppi: 'tyyppi',
    metadata: {
      tulevaisuudenAikataulu: [
        { alkaa: '2019-02-20T12:28', paattyy: '2019-08-01T12:45' },
      ],
      yhteystieto: {
        nimi: { fi: 'Fi nimi', sv: 'Sv nimi' },
        titteli: { fi: 'Fi titteli', sv: 'Sv titteli' },
        sahkoposti: { fi: 'Fi sähköposti', sv: 'Sv sähköposti' },
        puhelinnumero: { fi: 'Fi puhelinnumero', sv: 'Sv puhelinnumero' },
      },
    },
    hakukohteenMuokkaamisenTakaraja: '2019-03-11T09:45',
    ajastettuJulkaisu: '2020-01-20T05:00',
    alkamisvuosi: 2020,
    hakulomake: 'lomake',
  });

  expect(values).toMatchSnapshot();
});
