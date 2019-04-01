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
          fromDate: '01.02.2018',
          fromTime: '10:30',
          toDate: '02.03.2019',
          toTime: '11:45',
        },
        {
          fromDate: '01.06.2018',
          fromTime: '12:30',
          toDate: '02.09.2019',
          toTime: '16:15',
        },
      ],
      aikataulu: [
        {
          fromDate: '05.02.2018',
          fromTime: '09:30',
          toDate: '06.03.2019',
          toTime: '20:45',
        },
        {
          fromDate: '09.06.2018',
          fromTime: '15:30',
          toDate: '10.09.2019',
          toTime: '12:15',
        },
      ],
      liittäminen_pvm: '01.02.2018',
      liittäminen_aika: '11:45',
      muokkaus_pvm: '10.15.2019',
      muokkaus_aika: '05:30',
      julkaisu_pvm: '01.29.2020',
      julkaisu_aika: '00:00',
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
