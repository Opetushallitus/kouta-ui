import { isEmpty, uniq, without } from 'lodash-es';

import iterateTree from '#/src/utils/iterateTree';

const getAvailableTarjoajaOids = hierarkia => {
  const oids: Array<string> = [];

  iterateTree(hierarkia, ({ oid }) => {
    oid && oids.push(oid);
  });

  return oids;
};

const getTarjoajaOperations = (availableOids, oids) => {
  const normalizedOids = Array.isArray(oids) ? oids : [];
  const normalizedAvailableOids = Array.isArray(availableOids)
    ? availableOids
    : [];
  let inserted = normalizedOids;

  if (!isEmpty(normalizedAvailableOids)) {
    inserted = normalizedOids.filter(o => normalizedAvailableOids.includes(o));
  }

  return {
    inserted,
    deleted: without(availableOids, ...inserted),
  };
};

const mergeTarjoajat = (existingOids, valueOids, availableOids) => {
  const { inserted, deleted } = getTarjoajaOperations(availableOids, valueOids);

  return uniq(without([...(existingOids || []), ...inserted], ...deleted));
};

export const getTarjoajaOids = ({
  hierarkia,
  existingTarjoajat,
  newTarjoajat,
}) => {
  const availableTarjoajaOids = getAvailableTarjoajaOids(hierarkia);
  return mergeTarjoajat(existingTarjoajat, newTarjoajat, availableTarjoajaOids);
};
