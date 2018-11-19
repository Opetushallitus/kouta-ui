//TODO: Tässä tiedostossa olevat datat korvataan Demon jälkeen API:sta tulevilla tai osassa laskennallislla arvoilla.

export const getLukukausiOptions = () => [
  {
    label: 'Kevät',
    key: 'kevat'
  },
  {
    label: 'Kesä',
    key: 'kesa'
  },
  {
    label: 'Syksy',
    key: 'syksy'
  }
];

export const getOpetuskieliOptions = () => [
  {
    label: 'Suomi',
    key: 'fi'
  },
  {
    label: 'Ruotsi',
    key: 'sv'
  },
  {
    label: 'Englanti',
    key: 'en'
  }
];

export const getOpetusaikaOptions= () => [
  {
    label: 'Päiväopetus',
    key: 'paivaopetus'
  },
  {
    label: 'Iltaopetus',
    key: 'iltaopetus'
  },
  {
    label: 'Viikonloppuopetus',
    key: 'viikonloppuopetus'
  }
];

export const getOpetustapaOptions = () => [
  {
    label: 'Lähiopiskelu',
    key: 'lahiopiskelu'
  },
  {
    label: 'Etäopiskelu',
    key: 'etaopiskelu'
  }
];

export const getBooleanOptions = () => [
  {
    label: 'Ei',
    key: 'ei'
  },
  {
    label: 'Kyllä',
    key: 'kylla'
  }
];

export const getLisattavaOsioOptions = () => [
  {
    label: 'Opintojen rakenne',
    key: 'opintojen-rakenne'
  },
  {
    label: 'Jatko-opintomahdollisuudet',
    key: 'jatko-opintomahdollisuudet'
  },
  {
    label: 'Osaamisalan valinta',
    key: 'osaamisalan-valinta'
  },
  {
    label: 'Sisältö',
    key: 'sisalto'
  },
  {
    label: 'Uramahdollisuudet',
    key: 'uramahdollisuudet'
  },
  {
    label: 'Kohderyhmä',
    key: 'kohderyhma'
  },
  {
    label: 'Kansainvälistyminen',
    key: 'kansainvalistyminen'
  },
  {
    label: 'Yhteistyö muiden toimijoiden kanssa',
    key: 'yhteistyo'
  }
];

export const getLukuvuosiOptions = () => [
  {
    label: '2019',
    key: '2019'
  },
  {
    label: '2020',
    key: '2020'
  },
  {
    label: '2021',
    key: '2021'
  },
  {
    label: '2022',
    key: '2022'
  }
];
