import {setStates} from '../../utils/stateUtils';

export const APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_ENTRIES = 'APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_ENTRIES';
export const APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_GRID_CONFIG = 'APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_GRID_CONFIG;';

export const HaunLiitetytHakukohteetStore = () => setStates({
  [APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_ENTRIES]: getLiitetytHakukohteetEntries(),
  [APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_GRID_CONFIG]: {
    columns: [
      {
        id: 'oid',
        index: 0,
        visible: false
      },
      {
        id: 'nimi',
        index: 1,
        title: 'Hakukohteen nimi',
        sortOrder: 'DESCENDING',
        visible: true
      },
      {
        id: 'organisaatio',
        index: 2,
        title: 'Organisaatio',
        sortOrder: 'DESCENDING',
        visible: true
      },
      {
        id: 'toimipiste',
        index: 3,
        title: 'Toimipiste',
        sortOrder: 'DESCENDING',
        visible: true
      }
    ]
  }
});

//TODO: replace this with hakukohde entries coming from backend over ajax. This is for temporary demo purpose.

const getLiitetytHakukohteetEntries = () => [
  {
    nimi: 'Sosiaali- ja terveysalan perustutkinto',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Katsastajankatu',
    oid: '1'
  },

  {
    nimi: 'Sosiaali- ja terveysalan perustutkinto, PK',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Svinhufvudinkatu 13',
    oid: '2'
  },
  {
    nimi: 'Sosiaali- ja terveysalan perustutkinto, YO',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Katsastajankatu',
    oid: '3'
  },
  {
    nimi: 'Hakukohteen nimi A',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Katsastajankatu',
    oid: '4'
  },
  {
    nimi: 'Hakukohteen nimi B',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Katsastajankatu',
    oid: '5'
  },
  {
    nimi: 'Hakukohteen nimi C',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Katsastajankatu',
    oid: '6'
  },
  {
    nimi: 'Hakukohteen nimi D',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Katsastajankatu',
    oid: '7'
  },
  {
    nimi: 'Hakukohteen nimi E',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Katsastajankatu',
    oid: '8'
  },
  {
    nimi: 'Hakukohteen nimi F',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Katsastajankatu',
    oid: '9'
  },
  {
    nimi: 'Hakukohteen nimi G',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Katsastajankatu',
    oid: '10'
  },
  {
    nimi: 'Hakukohteen nimi',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Katsastajankatu',
    oid: '11'
  },
  {
    nimi: 'Hakukohteen nimi H',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Katsastajankatu',
    oid: '12'
  },
  {
    nimi: 'Hakukohteen nimi I',
    organisaatio: 'Koulutuskeskus Salpaus',
    toimipiste: 'Lahti, Katsastajankatu',
    oid: '13'
  }

];
