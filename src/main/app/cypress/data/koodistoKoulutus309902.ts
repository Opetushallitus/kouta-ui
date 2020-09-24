export default {
  koodiUri: 'koulutus_309902',
  resourceUri:
    'https://virkailija.hahtuvaopintopolku.fi/koodisto-service/rest/codeelement/koulutus_309902',
  version: 0,
  versio: 7,
  koodisto: {
    koodistoUri: 'koulutus',
    organisaatioOid: '1.2.246.562.10.00000000001',
    koodistoVersios: [12],
  },
  koodiArvo: '309902',
  paivitysPvm: '2019-06-06',
  paivittajaOid: '1.2.246.562.24.74973773005',
  voimassaAlkuPvm: '2016-06-01',
  voimassaLoppuPvm: null,
  tila: 'LUONNOS',
  metadata: [
    {
      nimi: 'Gymnasiets lärokurs',
      kuvaus: '',
      lyhytNimi: '',
      kayttoohje: '',
      kasite: '',
      sisaltaaMerkityksen: '',
      eiSisallaMerkitysta: '',
      huomioitavaKoodi: '',
      sisaltaaKoodiston: '',
      kieli: 'SV',
    },
    {
      nimi: 'Lukion oppimäärä',
      kuvaus: '',
      lyhytNimi: '',
      kayttoohje: '',
      kasite: '',
      sisaltaaMerkityksen: '',
      eiSisallaMerkitysta: '',
      huomioitavaKoodi: '',
      sisaltaaKoodiston: '',
      kieli: 'FI',
    },
  ],
  withinCodeElements: [],
  includesCodeElements: [
    {
      codeElementUri: 'isced2011koulutusastetaso2_31',
      codeElementVersion: 1,
      codeElementValue: '31',
      relationMetadata: [
        { nimi: 'Gymnasieutbildning', kieli: 'SV', kuvaus: null },
        { nimi: ' Lukiokoulutus', kieli: 'FI', kuvaus: null },
        {
          nimi: 'General upper secondary education',
          kieli: 'EN',
          kuvaus: null,
        },
      ],
      parentMetadata: [
        {
          nimi: 'ISCED 2011 Educational level(level2)',
          kieli: 'EN',
          kuvaus:
            'Kansainvälinen koulutusluokitus ISCED (Unesco International Standard Classification of Education) on tilastollisia tarkoituksia varten kehitetty koulutusluokitus, jota käytetään mm. Unescon, OECD:n ja Eurostatin kansainvälisissä tilastoissa ja indikaattoreissa verrattaessa koulutusta eri maissa. Luokituksen avulla voidaan luokittaa tutkintoon johtava ja tutkintoon johtamaton koulutus.',
        },
        {
          nimi: 'ISCED 2011 Utbildningsnivå(nivå2)',
          kieli: 'SV',
          kuvaus:
            'Kansainvälinen koulutusluokitus ISCED (Unesco International Standard Classification of Education) on tilastollisia tarkoituksia varten kehitetty koulutusluokitus, jota käytetään mm. Unescon, OECD:n ja Eurostatin kansainvälisissä tilastoissa ja indikaattoreissa verrattaessa koulutusta eri maissa. Luokituksen avulla voidaan luokittaa tutkintoon johtava ja tutkintoon johtamaton koulutus.',
        },
        {
          nimi: 'ISCED 2011, koulutusaste (taso 2)',
          kieli: 'FI',
          kuvaus:
            'Kansainvälinen koulutusluokitus ISCED (Unesco International Standard Classification of Education) on tilastollisia tarkoituksia varten kehitetty koulutusluokitus, jota käytetään mm. Unescon, OECD:n ja Eurostatin kansainvälisissä tilastoissa ja indikaattoreissa verrattaessa koulutusta eri maissa. Luokituksen avulla voidaan luokittaa tutkintoon johtava ja tutkintoon johtamaton koulutus.',
        },
      ],
      passive: false,
    },
    {
      codeElementUri: 'kansallinenkoulutusluokitus2016koulutusalataso1_00',
      codeElementVersion: 1,
      codeElementValue: '00',
      relationMetadata: [
        {
          nimi: 'Generic programmes and qualifications',
          kieli: 'EN',
          kuvaus: '',
        },
        { nimi: 'Yleissivistävä koulutus', kieli: 'FI', kuvaus: '' },
        { nimi: 'Allmänbildande utbildning', kieli: 'SV', kuvaus: '' },
      ],
      parentMetadata: [
        {
          nimi:
            'Nationell Utbildningsklassificering 2016, utbildningsområde (nivå 1)',
          kieli: 'SV',
          kuvaus: '',
        },
        {
          nimi: 'Kansallinen koulutusluokitus 2016, koulutusala (taso 1)',
          kieli: 'FI',
          kuvaus: '',
        },
        {
          nimi:
            'National classification of education 2016, field of education (broad field)',
          kieli: 'EN',
          kuvaus: '',
        },
      ],
      passive: false,
    },
    {
      codeElementUri: 'kansallinenkoulutusluokitus2016koulutusastetaso2_31',
      codeElementVersion: 1,
      codeElementValue: '31',
      relationMetadata: [
        {
          nimi: 'General upper secondary education',
          kieli: 'EN',
          kuvaus: null,
        },
        { nimi: ' Lukiokoulutus', kieli: 'FI', kuvaus: null },
        { nimi: 'Gymnasieutbildning', kieli: 'SV', kuvaus: null },
      ],
      parentMetadata: [
        {
          nimi:
            'Nationell Utbildningsklassificering 2016, utbildningsnivå, (nivå 2)',
          kieli: 'SV',
          kuvaus: '',
        },
        {
          nimi: 'Kansallinen koulutusluokitus 2016, koulutusaste (taso 2)',
          kieli: 'FI',
          kuvaus: '',
        },
        {
          nimi:
            'National classification of education 2016, level of education (level 2)',
          kieli: 'EN',
          kuvaus: '',
        },
      ],
      passive: false,
    },
    {
      codeElementUri: 'kansallinenkoulutusluokitus2016koulutusalataso3_0011',
      codeElementVersion: 1,
      codeElementValue: '0011',
      relationMetadata: [
        { nimi: 'Allmänbildande utbildning', kieli: 'SV', kuvaus: null },
        { nimi: 'Yleissivistävä koulutus', kieli: 'FI', kuvaus: null },
        {
          nimi: 'Basic programmes and qualifications',
          kieli: 'EN',
          kuvaus: null,
        },
      ],
      parentMetadata: [
        {
          nimi:
            'Nationell Utbildningsklassificering 2016, utbildningsområde (nivå 3)',
          kieli: 'SV',
          kuvaus: '',
        },
        {
          nimi: 'Kansallinen koulutusluokitus 2016, koulutusala (taso 3)',
          kieli: 'FI',
          kuvaus: '',
        },
        {
          nimi:
            'National classification of education 2016, field of education (detailed field)',
          kieli: 'EN',
          kuvaus: '',
        },
      ],
      passive: false,
    },
    {
      codeElementUri: 'kansallinenkoulutusluokitus2016koulutusastetaso1_3',
      codeElementVersion: 1,
      codeElementValue: '3',
      relationMetadata: [
        { nimi: 'Andra stadiet', kieli: 'SV', kuvaus: '' },
        { nimi: 'Toinen aste', kieli: 'FI', kuvaus: '' },
        { nimi: 'Upper secondary education', kieli: 'EN', kuvaus: '' },
      ],
      parentMetadata: [
        {
          nimi: 'Kansallinen koulutusluokitus 2016, koulutusaste (taso 1)',
          kieli: 'FI',
          kuvaus: '',
        },
        {
          nimi:
            'National classification of education 2016, level of education (level 1)',
          kieli: 'EN',
          kuvaus: '',
        },
        {
          nimi:
            'Nationell Utbildningsklassificering 2016, utbildningsnivå, (nivå 1)',
          kieli: 'SV',
          kuvaus: '',
        },
      ],
      passive: false,
    },
    {
      codeElementUri: 'kansallinenkoulutusluokitus2016koulutusalataso2_001',
      codeElementVersion: 1,
      codeElementValue: '001',
      relationMetadata: [
        { nimi: 'Allmänbildande utbildning', kieli: 'SV', kuvaus: '' },
        {
          nimi: 'Basic programmes and qualifications',
          kieli: 'EN',
          kuvaus: '',
        },
        { nimi: 'Yleissivistävä koulutus', kieli: 'FI', kuvaus: '' },
      ],
      parentMetadata: [
        {
          nimi: 'Kansallinen koulutusluokitus 2016, koulutusala (taso 2)',
          kieli: 'FI',
          kuvaus: '',
        },
        {
          nimi:
            'National classification of education 2016, field of education (narrow field)',
          kieli: 'EN',
          kuvaus: '',
        },
        {
          nimi:
            'Nationell Utbildningsklassificering 2016, utbildningsområde (nivå 2)',
          kieli: 'SV',
          kuvaus: '',
        },
      ],
      passive: false,
    },
    {
      codeElementUri: 'tutkintotyyppi_01',
      codeElementVersion: 1,
      codeElementValue: '01',
      relationMetadata: [
        {
          nimi: 'Allmänbildande utbildning',
          kieli: 'SV',
          kuvaus: 'Allmänbildande utbildning',
        },
        {
          nimi: 'Yleissivistävä koulutus',
          kieli: 'FI',
          kuvaus: 'Yleissivistävä koulutus',
        },
      ],
      parentMetadata: [
        { nimi: 'tutkintotyyppi', kieli: 'SV', kuvaus: 'tutkintotyyppi' },
        { nimi: 'tutkintotyyppi', kieli: 'FI', kuvaus: 'tutkintotyyppi' },
        { nimi: 'tutkintotyyppi', kieli: 'EN', kuvaus: 'tutkintotyyppi' },
      ],
      passive: false,
    },
  ],
  levelsWithCodeElements: [],
};
