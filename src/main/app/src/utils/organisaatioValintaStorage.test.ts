import { vi } from 'vitest';

import {
  loadOrganisaatioFavourites,
  loadOrganisaatioOid,
  migrateLegacyStorage,
  ORGANISAATIO_FAVOURITES_KEY,
  ORGANISAATIO_OID_KEY,
  saveOrganisaatioFavourites,
  saveOrganisaatioOid,
} from './organisaatioValintaStorage';

const A = '1.2.246.562.10.1';
const B = '1.2.246.562.10.2';
const C = '1.2.246.562.10.3';

const LEGACY_SELECTION_KEY = 'persist:organisaatioSelection';
const LEGACY_FAVOURITES_KEY = 'persist:organisaatioFavourites';

// redux-persistin muoto: jokainen kenttä erikseen JSON-koodattuna.
const legacy = (fields: Record<string, unknown>) =>
  JSON.stringify({
    ...Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, JSON.stringify(value)])
    ),
    _persist: JSON.stringify({ version: 1, rehydrated: true }),
  });

const stored = (key: string) => localStorage.getItem(key);

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('load and save', () => {
  test('defaults when nothing is stored', () => {
    expect(loadOrganisaatioOid()).toBeNull();
    expect(loadOrganisaatioFavourites()).toEqual([]);
  });

  test('round-trips', () => {
    saveOrganisaatioOid(A);
    saveOrganisaatioFavourites([B, A]);

    expect(loadOrganisaatioOid()).toBe(A);
    expect(loadOrganisaatioFavourites()).toEqual([B, A]);
  });

  test('drops invalid favourite entries', () => {
    localStorage.setItem(
      ORGANISAATIO_FAVOURITES_KEY,
      JSON.stringify([A, '', 3, A, B])
    );
    expect(loadOrganisaatioFavourites()).toEqual([A, B]);
  });

  test('corrupt values fall back to defaults', () => {
    localStorage.setItem(ORGANISAATIO_OID_KEY, '{not json');
    localStorage.setItem(ORGANISAATIO_FAVOURITES_KEY, '{not json');
    expect(loadOrganisaatioOid()).toBeNull();
    expect(loadOrganisaatioFavourites()).toEqual([]);

    localStorage.setItem(ORGANISAATIO_OID_KEY, JSON.stringify(''));
    localStorage.setItem(ORGANISAATIO_FAVOURITES_KEY, JSON.stringify({}));
    expect(loadOrganisaatioOid()).toBeNull();
    expect(loadOrganisaatioFavourites()).toEqual([]);
  });

  test('a throwing storage yields defaults and does not propagate', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(loadOrganisaatioOid()).toBeNull();
    expect(loadOrganisaatioFavourites()).toEqual([]);
    expect(() => saveOrganisaatioOid(A)).not.toThrow();
    expect(() => saveOrganisaatioFavourites([A])).not.toThrow();
  });
});

describe('migrateLegacyStorage', () => {
  test('writes both legacy values to the new keys and keeps the old ones', () => {
    localStorage.setItem(LEGACY_SELECTION_KEY, legacy({ oid: B }));
    localStorage.setItem(
      LEGACY_FAVOURITES_KEY,
      legacy({ byOid: { [C]: true, [A]: true, [B]: true } })
    );

    migrateLegacyStorage();

    expect(stored(ORGANISAATIO_OID_KEY)).toBe(JSON.stringify(B));
    // Lisäysjärjestys, ei aakkosjärjestys.
    expect(stored(ORGANISAATIO_FAVOURITES_KEY)).toBe(JSON.stringify([C, A, B]));
    expect(stored(LEGACY_SELECTION_KEY)).not.toBeNull();
    expect(stored(LEGACY_FAVOURITES_KEY)).not.toBeNull();
  });

  test('does not overwrite existing new keys', () => {
    saveOrganisaatioOid(A);
    saveOrganisaatioFavourites([A]);
    localStorage.setItem(LEGACY_SELECTION_KEY, legacy({ oid: B }));
    localStorage.setItem(
      LEGACY_FAVOURITES_KEY,
      legacy({ byOid: { [B]: true } })
    );

    migrateLegacyStorage();

    expect(loadOrganisaatioOid()).toBe(A);
    expect(loadOrganisaatioFavourites()).toEqual([A]);
  });

  test('migrates the slices independently', () => {
    saveOrganisaatioOid(A);
    localStorage.setItem(LEGACY_SELECTION_KEY, legacy({ oid: B }));
    localStorage.setItem(
      LEGACY_FAVOURITES_KEY,
      legacy({ byOid: { [B]: true } })
    );

    migrateLegacyStorage();

    expect(loadOrganisaatioOid()).toBe(A);
    expect(loadOrganisaatioFavourites()).toEqual([B]);
  });

  test('writes nothing for a missing, null, empty or corrupt legacy value', () => {
    migrateLegacyStorage();
    expect(stored(ORGANISAATIO_OID_KEY)).toBeNull();
    expect(stored(ORGANISAATIO_FAVOURITES_KEY)).toBeNull();

    localStorage.setItem(LEGACY_SELECTION_KEY, legacy({ oid: null }));
    migrateLegacyStorage();
    expect(stored(ORGANISAATIO_OID_KEY)).toBeNull();

    localStorage.setItem(LEGACY_SELECTION_KEY, legacy({ oid: '' }));
    migrateLegacyStorage();
    expect(stored(ORGANISAATIO_OID_KEY)).toBeNull();

    localStorage.setItem(LEGACY_SELECTION_KEY, '{not json');
    localStorage.setItem(
      LEGACY_FAVOURITES_KEY,
      JSON.stringify({ byOid: '{not json' })
    );
    migrateLegacyStorage();
    expect(stored(ORGANISAATIO_OID_KEY)).toBeNull();
    expect(stored(ORGANISAATIO_FAVOURITES_KEY)).toBeNull();
  });

  test('drops favourites whose legacy flag is false', () => {
    localStorage.setItem(
      LEGACY_FAVOURITES_KEY,
      legacy({ byOid: { [A]: true, [B]: false } })
    );

    migrateLegacyStorage();

    expect(loadOrganisaatioFavourites()).toEqual([A]);
  });
});
