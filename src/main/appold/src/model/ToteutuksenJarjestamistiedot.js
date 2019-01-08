//TODO: Tässä tiedostossa olevat datat korvataan Demon jälkeen API:sta tulevilla tai osassa laskennallislla arvoilla.

export const getLukukausiOptions = () => [
  {
    label: 'Kevät',
    key: 'kausi_k#1'
  },
  {
    label: 'Kesä',
    key: 'kausi_kesa#2' //Huom! Ei ole oikeasti vielä koodistossa
  },
  {
    label: 'Syksy',
    key: 'kausi_s#1'
  }
];

export const getOpetuskieliOptions = () => [
  {
    label: 'Suomi',
    key: 'kieli_fi#1'
  },
  {
    label: 'Ruotsi',
    key: 'kieli_sv#1'
  },
  {
    label: 'Englanti',
    key: 'kieli_en#1'
  }
];

export const getOpetusaikaOptions= () => [
  {
    label: 'Päiväopetus',
    key: 'opetusaikakk_1#1'
  },
  {
    label: 'Iltaopetus',
    key: 'opetusaikakk_2#1'
  },
  {
    label: 'Viikonloppuopetus',
    key: 'opetusaikakk_3#1'
  }
];

export const getOpetustapaOptions = () => [
  {
    label: 'Lähiopetus',
    key: 'opetuspaikkakk_1#1'
  },
  {
    label: 'Etäopetus',
    key: 'opetuspaikkakk_2#1'
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
