import { renderHook } from '@testing-library/react-hooks';

import { ORGANISAATIOTYYPPI } from '#/src/constants';
import { Organisaatio } from '#/src/types/domainTypes';

import { useItemsToShow } from './useItemsToShow';

const createOrg = ({
  oid = '1.2.3.4',
  nimi = {},
  parentOids = [],
  organisaatiotyyppiUris = [],
  children = [],
}: Partial<Organisaatio>): Organisaatio => ({
  oid,
  nimi,
  parentOids,
  organisaatiotyyppiUris,
  children,
});

test('useItemsToShow vain vain valitut organisaatiot, kun naytaVainValitut=true', () => {
  const { result } = renderHook(() =>
    useItemsToShow({
      organisaatiot: [
        createOrg({ oid: '1.1.1.1' }),
        createOrg({ oid: '2.2.2.2' }),
      ],
      value: ['1.1.1.1'],
      naytaVainValitut: true,
    })
  );

  expect(result.current).toEqual([createOrg({ oid: '1.1.1.1' })]);
});

test('useItemsToShow palauttaa vain oppilaitokset, paitsi valituille koulutustoimijoille, eikä sen lapsi-oppilaitoksia', () => {
  const org1_2 = createOrg({
    oid: '2.2.2.2',
    parentOids: ['2.2.2.2', '1.1.1.1'],
    organisaatiotyyppiUris: [ORGANISAATIOTYYPPI.OPPILAITOS],
  });

  const org1 = createOrg({
    oid: '1.1.1.1',
    organisaatiotyyppiUris: [ORGANISAATIOTYYPPI.KOULUTUSTOIMIJA],
    children: [org1_2],
  });

  const org2_1 = createOrg({
    oid: '2.2.2.3',
    parentOids: ['2.2.2.3', '1.1.1.2'],
    organisaatiotyyppiUris: [ORGANISAATIOTYYPPI.OPPILAITOS],
  });

  const org2 = createOrg({
    oid: '1.1.1.2',
    organisaatiotyyppiUris: [ORGANISAATIOTYYPPI.KOULUTUSTOIMIJA],
    children: [org2_1],
  });

  const { result } = renderHook(() =>
    useItemsToShow({
      organisaatiot: [org1, org2, org1_2, org2_1],
      value: [org1.oid],
      naytaVainValitut: false,
    })
  );

  expect(result.current).toEqual([org1, org2_1]);
});