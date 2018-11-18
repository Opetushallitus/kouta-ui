import {getState, setState, setStates, updateState} from '../../utils/stateUtils';

export const APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_ENTRIES = 'APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_ENTRIES';
export const APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_GRID_CONFIG = 'APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_GRID_CONFIG;';

export const HaunLiitetytHakukohteetStore = () => setStates({
  [APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_ENTRIES]: mockLiitetytHakukohteetEntries(),
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
        sortIndex: 0,
        sortDirection: 'asc',
        title: 'Hakukohteen nimi',
        visible: true
      },
      {
        id: 'organisaatio',
        index: 2,
        sortIndex: 1,
        sortDirection: 'asc',
        title: 'Organisaatio',
        visible: true
      },
      {
        id: 'toimipiste',
        index: 3,
        sortIndex: 2,
        sortDirection: 'asc',
        title: 'Toimipiste',
        sortOrder: 'asc',
        visible: true
      }
    ]
  }
});

//TODO: replace this with hakukohde entries coming from backend over ajax. This is for temporary demo purpose.

const mockLiitetytHakukohteetEntries = () => [
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

const getHaunLiitetytHakukohteetEntries = () => getState(APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_ENTRIES);

export const toggleHakukohdeActive = (oid) => {
  const entries = getHaunLiitetytHakukohteetEntries().map(iEntry => iEntry.oid === oid ? ({
    ...iEntry,
    active: !(iEntry.active === true)
  }) : iEntry);
  setState(APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_ENTRIES, entries);
};

export const updateColumns = (columns) => updateState(APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_GRID_CONFIG, {
  columns: columns
});

export const deselectRows = () => {
  const entries = getHaunLiitetytHakukohteetEntries().map(iEntry => ({
    ...iEntry,
    active: false
  }));
  setState(APP_STATE_HAUN_LIITETYT_HAKUKOHTEET_ENTRIES, entries);
};
