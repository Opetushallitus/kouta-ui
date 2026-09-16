import React from 'react';

import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import {
  ORGANISAATIO_FAVOURITES_KEY,
  ORGANISAATIO_OID_KEY,
} from '#/src/utils/organisaatioValintaStorage';

import {
  OrganisaatioValintaProvider,
  useOrganisaatioFavourites,
  useOrganisaatioSelection,
  useSelectedOrganisaatioOid,
} from './OrganisaatioValintaContext';

const A = '1.2.246.562.10.1';
const B = '1.2.246.562.10.2';
const C = '1.2.246.562.10.3';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <OrganisaatioValintaProvider>{children}</OrganisaatioValintaProvider>
);

const stored = (key: string) => JSON.parse(localStorage.getItem(key) ?? 'null');

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

test('stored values are available on the first render', () => {
  localStorage.setItem(ORGANISAATIO_OID_KEY, JSON.stringify(A));
  localStorage.setItem(ORGANISAATIO_FAVOURITES_KEY, JSON.stringify([B, A]));

  const { result } = renderHook(
    () => ({
      oid: useSelectedOrganisaatioOid(),
      favourites: useOrganisaatioFavourites().favourites,
    }),
    { wrapper }
  );

  expect(result.current.oid).toBe(A);
  expect(result.current.favourites).toEqual([B, A]);
});

test('setOrganisaatioOid updates the state and the storage', () => {
  const { result } = renderHook(() => useOrganisaatioSelection(), { wrapper });
  expect(result.current.organisaatioOid).toBeNull();

  act(() => result.current.setOrganisaatioOid(B));

  expect(result.current.organisaatioOid).toBe(B);
  expect(stored(ORGANISAATIO_OID_KEY)).toBe(B);
});

test('toggleFavourite appends on add and keeps the order on remove', () => {
  const { result } = renderHook(() => useOrganisaatioFavourites(), {
    wrapper,
  });

  act(() => result.current.toggleFavourite(A));
  act(() => result.current.toggleFavourite(B));
  act(() => result.current.toggleFavourite(C));
  expect(result.current.favourites).toEqual([A, B, C]);
  expect(stored(ORGANISAATIO_FAVOURITES_KEY)).toEqual([A, B, C]);

  act(() => result.current.toggleFavourite(B));
  expect(result.current.favourites).toEqual([A, C]);
  expect(stored(ORGANISAATIO_FAVOURITES_KEY)).toEqual([A, C]);

  act(() => result.current.toggleFavourite(B));
  expect(result.current.favourites).toEqual([A, C, B]);
  expect(stored(ORGANISAATIO_FAVOURITES_KEY)).toEqual([A, C, B]);
});

test('the hooks throw outside the provider', () => {
  // React kirjaa heiton myös console.erroriin; se ei kuulu testin tulosteeseen.
  vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => renderHook(() => useOrganisaatioSelection())).toThrow(
    /OrganisaatioSelectionContext/
  );
  expect(() => renderHook(() => useOrganisaatioFavourites())).toThrow(
    /OrganisaatioFavouritesContext/
  );
});
