import _fp from 'lodash/fp';

import {
  KOULUTUSTYYPIT,
  KOULUTUSTYYPPI,
  EI_TUETUT_KOULUTUSTYYPIT,
  ENTITY,
  ONLY_OPH_CAN_SAVE_KOULUTUS_KOULUTUSTYYPIT,
} from '#/src/constants';

import { createIsKoulutustyyppiDisabledGetter } from './useOppilaitosTyypit';

const getIsDisabledForOPH = createIsKoulutustyyppiDisabledGetter({
  isOphVirkailija: true,
  allowedOppilaitostyypit: [],
  oppilaitostyypitByKoulutustyypit: [],
  entityType: ENTITY.KOULUTUS,
});

const getIsDisabledForOppilaitostyypit = (
  oppilaitostyypit,
  oppilaitostyypitByKoulutustyypit
) => {
  return createIsKoulutustyyppiDisabledGetter({
    isOphVirkailija: false,
    allowedOppilaitostyypit: oppilaitostyypit,
    oppilaitostyypitByKoulutustyypit,
    entityType: ENTITY.KOULUTUS,
  });
};

const getIsDisabledForAll = createIsKoulutustyyppiDisabledGetter({
  isOphVirkailija: false,
  allowedOppilaitostyypit: [],
  oppilaitostyypitByKoulutustyypit: [],
  entityType: ENTITY.KOULUTUS,
});

const getIsDisabledForNone = createIsKoulutustyyppiDisabledGetter({
  isOphVirkailija: false,
  allowedOppilaitostyypit: [],
  oppilaitostyypitByKoulutustyypit: [],
  entityType: ENTITY.KOULUTUS,
});

test.each(_fp.difference(KOULUTUSTYYPIT)(EI_TUETUT_KOULUTUSTYYPIT))(
  'Creating KOMO with any koulutustyyppi should be allowed for OPH',
  kt => {
    expect(getIsDisabledForOPH(kt)).toEqual(false);
  }
);

test.each(ONLY_OPH_CAN_SAVE_KOULUTUS_KOULUTUSTYYPIT)(
  'Koulutustyyppis that only OPH creates should be disabled for others',
  kt => {
    expect(getIsDisabledForAll(kt)).toEqual(true);
  }
);

test.each(
  _fp.difference(KOULUTUSTYYPIT)(
    _fp.union(EI_TUETUT_KOULUTUSTYYPIT)(
      ONLY_OPH_CAN_SAVE_KOULUTUS_KOULUTUSTYYPIT
    )
  )
)(
  'Should not disable any koulutustyyppi when not detecting any oppilaitos types',
  kt => {
    expect(getIsDisabledForNone(kt)).toEqual(false);
  }
);

test('Should disable lukiokoulutus for any oppilaitostyyppi', () => {
  const oppilaitostyypit = ['oppilaitostyyppi_15', 'oppilaitostyyppi_42'];

  expect(
    getIsDisabledForOppilaitostyypit(oppilaitostyypit, [
      {
        koulutustyyppi: KOULUTUSTYYPPI.LUKIOKOULUTUS,
        oppilaitostyypit,
      },
    ])(KOULUTUSTYYPPI.LUKIOKOULUTUS)
  ).toEqual(true);
});

test('Should disable koulutus when oppilaitostyyppi mapping not found', () => {
  const oppilaitostyypit = ['oppilaitostyyppi_23', 'oppilaitostyyppi_24'];

  expect(
    getIsDisabledForOppilaitostyypit(oppilaitostyypit, [
      {
        koulutustyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
        oppilaitostyypit,
      },
      {
        koulutustyyppi: KOULUTUSTYYPPI.TUTKINNON_OSA,
        oppilaitostyypit,
      },
      {
        koulutustyyppi: KOULUTUSTYYPPI.OSAAMISALA,
        oppilaitostyypit,
      },
      {
        koulutustyyppi: KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
        oppilaitostyypit,
      },
    ])(KOULUTUSTYYPPI.AMKKOULUTUS)
  ).toEqual(true);
});

test('Should enable amk-koulutustyyppi for amk-oppilaitostyyppi', () => {
  const oppilaitostyypit = ['oppilaitostyyppi_41'];

  expect(
    getIsDisabledForOppilaitostyypit(oppilaitostyypit, [
      {
        koulutustyyppi: KOULUTUSTYYPPI.AMKKOULUTUS,
        oppilaitostyypit,
      },
    ])(KOULUTUSTYYPPI.AMKKOULUTUS)
  ).toEqual(false);
});

test('Should enable yo-koulutustyyppi for all yo-oppilaitostyyppi', () => {
  const oppilaitostyypit = ['oppilaitostyyppi_42'];

  expect(
    getIsDisabledForOppilaitostyypit(oppilaitostyypit, [
      {
        koulutustyyppi: KOULUTUSTYYPPI.YLIOPISTOKOULUTUS,
        oppilaitostyypit,
      },
    ])(KOULUTUSTYYPPI.YLIOPISTOKOULUTUS)
  ).toEqual(false);
});

test('Should disable ammatillinen koulutustyyppi for amm-oppilaitostyyppi', () => {
  const oppilaitostyypit = ['oppilaitostyyppi_21'];

  expect(
    getIsDisabledForOppilaitostyypit(oppilaitostyypit, [
      {
        koulutustyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
        oppilaitostyypit,
      },
    ])(KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS)
  ).toEqual(true);
});

test('Should enable amm. tutkinnon osa for amm koulutustyyppi', () => {
  const oppilaitostyypit = ['oppilaitostyyppi_21'];
  expect(
    getIsDisabledForOppilaitostyypit(oppilaitostyypit, [
      {
        koulutustyyppi: KOULUTUSTYYPPI.TUTKINNON_OSA,
        oppilaitostyypit,
      },
    ])(KOULUTUSTYYPPI.TUTKINNON_OSA)
  ).toEqual(false);
});

test('Should enable amm. osaamisala for amm koulutustyyppi', () => {
  const oppilaitostyypit = ['oppilaitostyyppi_21'];
  expect(
    getIsDisabledForOppilaitostyypit(oppilaitostyypit, [
      {
        koulutustyyppi: KOULUTUSTYYPPI.OSAAMISALA,
        oppilaitostyypit,
      },
    ])(KOULUTUSTYYPPI.OSAAMISALA)
  ).toEqual(false);
});

test('Should enable muu ammatillinen koulutus for ammatilinen oppilaitos', () => {
  const oppilaitostyypit = [
    'oppilaitostyyppi_21',
    'oppilaitostyyppi_22',
    'oppilaitostyyppi_23',
  ];
  expect(
    getIsDisabledForOppilaitostyypit(oppilaitostyypit, [
      {
        koulutustyyppi: KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS,
        oppilaitostyypit,
      },
      {
        koulutustyyppi: KOULUTUSTYYPPI.TUTKINNON_OSA,
        oppilaitostyypit,
      },
      {
        koulutustyyppi: KOULUTUSTYYPPI.OSAAMISALA,
        oppilaitostyypit,
      },
      {
        koulutustyyppi: KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS,
        oppilaitostyypit,
      },
    ])(KOULUTUSTYYPPI.MUU_AMMATILLINEN_KOULUTUS)
  ).toEqual(false);
});
