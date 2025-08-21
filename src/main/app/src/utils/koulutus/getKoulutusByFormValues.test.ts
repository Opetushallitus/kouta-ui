import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { JULKAISUTILA, KOULUTUSTYYPPI, MaaraTyyppi } from '#/src/constants';
import { KoulutusFormValues } from '#/src/types/koulutusTypes';
import getKoulutusByFormValues from '#/src/utils/koulutus/getKoulutusByFormValues';

const KOULUTUS_FORM_VALUES_BASE: KoulutusFormValues = {
  tila: JULKAISUTILA.TALLENNETTU,
  muokkaaja: undefined,
  kieliversiot: [],
  tarjoajat: {
    kaytaPohjanJarjestajaa: false,
    tarjoajat: [],
  },
  information: {
    nimi: {},
    eperuste: { value: undefined },
    koulutus: {
      value: undefined,
    },
    korkeakoulutukset: [],
    tutkintonimike: [],
    koulutusalat: [],
  },
  koulutustyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
  lisatiedot: {
    osioKuvaukset: {},
    osiot: [],
  },
  description: {
    kuvaus: {},
  },
  tutkinnonosat: {
    nimi: {},
    osat: [],
  },
  soraKuvaus: {
    value: '',
  },
  julkinen: false,
};

test('getKoulutusByFormValues returns correct koulutus given form values', () => {
  const koulutus = getKoulutusByFormValues({
    externalId: 'ext1',
    tila: JULKAISUTILA.TALLENNETTU,
    muokkaaja: '1.1.1.1',
    kieliversiot: ['fi', 'sv'],
    tarjoajat: {
      kaytaPohjanJarjestajaa: false,
      tarjoajat: ['123.456.789'],
    },
    information: {
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
      koulutus: {
        value: 'koulutuskoodi_1#1',
      },
      korkeakoulutukset: [
        { value: 'koulutus_371101#1' },
        { value: 'koulutus_201000#1' },
      ],
      tutkintonimike: [{ value: 'nimike_1#1' }, { value: 'nimike_2#1' }],
      koulutusalat: [
        { value: 'koulutusala_1#1' },
        { value: 'koulutusala_2#1' },
      ],
      luokittelutermit: [
        {
          label: 'termi1',
          value: 'termi1',
        },
        {
          label: 'termi2',
          value: 'termi2',
        },
      ],
    },
    koulutustyyppi: KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
    lisatiedot: {
      osioKuvaukset: {
        'osio_1#1': {},
        'osio_2#1': {
          fi: parseEditorState('Fi kuvaus'),
          sv: parseEditorState('Sv kuvaus'),
        },
      },
      osiot: [{ value: 'osio_1#1' }, { value: 'osio_2#1' }],
    },
    description: {
      kuvaus: {
        fi: parseEditorState('Fi kuvaus'),
        sv: parseEditorState('Sv kuvaus'),
      },
    },
    tutkinnonosat: {
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
      osat: [
        {
          eperuste: { value: '1234' },
          koulutus: { value: 'koulutuskoodi_2#1' },
          osat: [],
        },
      ],
    },
    soraKuvaus: {
      value: '1234',
    },
    julkinen: true,
  });

  expect(koulutus).toMatchSnapshot();
});

test('getKoulutusByFormValues returns correct koulutuksetKoodiUri for ammatillinen koulutus', () => {
  const koulutus = getKoulutusByFormValues({
    ...KOULUTUS_FORM_VALUES_BASE,
    externalId: 'ext1',
    information: {
      nimi: {},
      eperuste: { value: '1' },
      koulutus: {
        value: 'koulutuskoodi_1#1',
      },
      korkeakoulutukset: [],
      tutkintonimike: [{ value: 'nimike_1#1' }, { value: 'nimike_2#1' }],
      koulutusalat: [
        { value: 'koulutusala_1#1' },
        { value: 'koulutusala_2#1' },
      ],
    },
    koulutustyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
    tutkinnonosat: {
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
      osat: [],
    },
  });

  expect(koulutus).toMatchSnapshot();
});

test('for osaamisala koulutus, koulutusKoodiUri is resolved', () => {
  const koulutus = getKoulutusByFormValues({
    ...KOULUTUS_FORM_VALUES_BASE,
    information: {
      nimi: {},
      koulutus: {
        value: 'koulutuskoodi_1#1',
      },
      korkeakoulutukset: [],
      tutkintonimike: [],
      koulutusalat: [],
    },
    osaamisala: {
      koulutus: { value: 'koulutus_371101#1' },
      eperuste: { value: undefined },
      osaamisala: { value: undefined },
    },
    koulutustyyppi: KOULUTUSTYYPPI.OSAAMISALA,
  });

  expect(koulutus).toMatchSnapshot();
});

test('it should return empty array if no koulutusKoodiUri given', () => {
  const koulutus = getKoulutusByFormValues({
    ...KOULUTUS_FORM_VALUES_BASE,
    koulutustyyppi: KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
  });

  expect(koulutus).toMatchSnapshot();
});

test('for erikoistumiskoulutus, erikoistumiskoulutusKoodiUri is resolved', () => {
  const koulutus = getKoulutusByFormValues({
    ...KOULUTUS_FORM_VALUES_BASE,
    information: {
      ...KOULUTUS_FORM_VALUES_BASE.information,
      erikoistumiskoulutus: {
        value: 'erikoistumiskoulutukset_001#2',
      },
      opintojenLaajuusyksikko: {
        value: 'opintojenlaajuusyksikko_2#1',
      },
      laajuusNumeroTyyppi: MaaraTyyppi.VAIHTELUVALI,
      opintojenLaajuusNumeroMin: '5.0',
      opintojenLaajuusNumeroMax: '10',
      koulutusalat: [
        { value: 'koulutusala_1#1' },
        { value: 'koulutusala_2#1' },
      ],
    },
    koulutustyyppi: KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
    description: {
      kuvaus: {},
      osaamistavoitteet: {
        fi: parseEditorState('Fi osaamistavoitteet'),
        sv: parseEditorState('Sv osaamistavoitteet'),
      },
    },
  });

  expect(koulutus).toMatchSnapshot();
});
