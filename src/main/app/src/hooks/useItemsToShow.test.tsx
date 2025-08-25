import { renderHook } from '@testing-library/react';

import { ORGANISAATIOTYYPPI } from '#/src/constants';
import { OrganisaatioModel } from '#/src/types/domainTypes';

import { useItemsToShow } from './useItemsToShow';

const createOrg = ({
  oid = '1.2.3.4',
  nimi = {},
  kieletUris = ['oppilaitoksenopetuskieli_1#2'],
  parentOids = [],
  organisaatiotyyppiUris = [],
  children = [],
}: Partial<OrganisaatioModel>): OrganisaatioModel => ({
  oid,
  nimi,
  kieletUris,
  parentOids,
  organisaatiotyyppiUris,
  children,
});

test('useItemsToShow vain vain valitut organisaatiot, kun naytaVainValitut=true', () => {
  const { result } = renderHook(() =>
    useItemsToShow({
      organisaatiot: [
        createOrg({ oid: '1.2.246.562.10.1111' }),
        createOrg({ oid: '1.2.246.562.10.2222' }),
      ],
      value: ['1.2.246.562.10.1111'],
      naytaVainValitut: true,
    })
  );

  expect(result.current).toEqual([createOrg({ oid: '1.2.246.562.10.1111' })]);
});

test('useItemsToShow palauttaa vain oppilaitokset, paitsi valituille koulutustoimijoille, eikä sen lapsi-oppilaitoksia', () => {
  const org1_2 = createOrg({
    oid: '1.2.246.562.10.2222',
    parentOids: ['1.2.246.562.10.2222', '1.2.246.562.10.1111'],
    organisaatiotyyppiUris: [ORGANISAATIOTYYPPI.OPPILAITOS],
  });

  const org1 = createOrg({
    oid: '1.2.246.562.10.1111',
    organisaatiotyyppiUris: [ORGANISAATIOTYYPPI.KOULUTUSTOIMIJA],
    children: [org1_2],
  });

  const org2_1 = createOrg({
    oid: '1.2.246.562.10.2223',
    parentOids: ['1.2.246.562.10.2223', '1.2.246.562.10.1112'],
    organisaatiotyyppiUris: [ORGANISAATIOTYYPPI.OPPILAITOS],
  });

  const org2 = createOrg({
    oid: '1.2.246.562.10.1112',
    organisaatiotyyppiUris: [ORGANISAATIOTYYPPI.KOULUTUSTOIMIJA],
    children: [org2_1],
  });

  const { result } = renderHook(() =>
    useItemsToShow({
      organisaatiot: [org1, org2, org1_2, org2_1],
      value: [org1.oid ?? ''],
      naytaVainValitut: false,
    })
  );

  expect(result.current).toEqual([org1, org2_1]);
});
