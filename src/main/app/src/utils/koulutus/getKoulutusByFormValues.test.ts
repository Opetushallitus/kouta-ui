import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { JULKAISUTILA, KOULUTUSTYYPPI, MaaraTyyppi } from '#/src/constants';
import getKoulutusByFormValues from '#/src/utils/koulutus/getKoulutusByFormValues';

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
      luokittelutermit: {
        fi: [
          {
            label: 'termi1',
            value: 'termi1',
          },
        ],
        sv: [
          {
            label: 'termi2',
            value: 'termi2',
          },
        ],
      },
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
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
    },
    tutkinnonosat: {
      osat: [
        {
          eperuste: { value: '1234' },
          koulutus: { value: 'koulutuskoodi_2#1' },
          tutkinnonosa: { value: '567567' },
          tutkinnonosaviite: '9847598475',
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
    externalId: 'ext1',
    koulutustyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
    information: {
      nimi: {
        fi: 'Fi nimi',
        sv: 'Sv nimi',
      },
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
  });

  expect(koulutus).toMatchSnapshot();
});

test('for osaamisala koulutus, koulutusKoodiUri is resolved', () => {
  const koulutus = getKoulutusByFormValues({
    information: {
      korkeakoulutukset: [],
    },
    osaamisala: { koulutus: { value: 'koulutus_371101#1' } },
    koulutustyyppi: 'amm-osaamisala',
  });

  expect(koulutus).toMatchSnapshot();
});

test('it should return empty array if no koulutusKoodiUri given', () => {
  const koulutus = getKoulutusByFormValues({
    information: {},
    koulutustyyppi: 'yo',
  });

  expect(koulutus).toMatchSnapshot();
});

test('for erikoistumiskoulutus, erikoistumiskoulutusKoodiUri is resolved', () => {
  const koulutus = getKoulutusByFormValues({
    information: {
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
    koulutustyyppi: 'erikoistumiskoulutus',
  });

  expect(koulutus).toMatchSnapshot();
});
