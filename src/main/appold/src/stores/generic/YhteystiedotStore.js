export const getInitialValueMap = () => ({
  nimi: {
    fi: '',
    sv: '',
    en: ''
  },
  titteli: {
    fi: '',
    sv: '',
    en: ''
  },
  sahkoposti: {
    fi: '',
    sv: '',
    en: ''
  },
  puhelinnumero: {
    fi: '',
    sv: '',
    en: ''
  }
});

export const getFields = () => [
  {
    id: 'nimi',
    label: 'Nimi'
  },
  {
    id: 'titteli',
    label: 'Titteli?'
  },
  {
    id: 'sahkoposti',
    label: 'Sähköposti'
  },
  {
    id: 'puhelinnumero',
    label: 'Puhelinnumero'
  }
];
