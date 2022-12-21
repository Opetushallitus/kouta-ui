import _ from 'lodash';

import iterateTree from '#/src/utils/iterateTree';

const getAvailableTarjoajaOids = hierarkia => {
  const oids: Array<string> = [];

  iterateTree(hierarkia, ({ oid }) => {
    oid && oids.push(oid);
  });

  return oids;
};

const getTarjoajaOperations = (availableOids, oids) => {
  const normalizedOids = _.isArray(oids) ? oids : [];
  const normalizedAvailableOids = _.isArray(availableOids) ? availableOids : [];
  let inserted = normalizedOids;

  if (!_.isEmpty(normalizedAvailableOids)) {
    inserted = normalizedOids.filter(o => normalizedAvailableOids.includes(o));
  }

  return {
    inserted,
    deleted: _.without(availableOids, ...inserted),
  };
};

const mergeTarjoajat = (existingOids, valueOids, availableOids) => {
  const { inserted, deleted } = getTarjoajaOperations(availableOids, valueOids);

  return _.uniq(_.without([...(existingOids || []), ...inserted], ...deleted));
};

export const getTarjoajaOids = ({
  hierarkia,
  existingTarjoajat,
  newTarjoajat,
}) => {
  const availableTarjoajaOids = getAvailableTarjoajaOids(hierarkia);
  return mergeTarjoajat(existingTarjoajat, newTarjoajat, availableTarjoajaOids);
};
