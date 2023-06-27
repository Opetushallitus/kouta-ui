import _ from 'lodash';

import { HAKULOMAKETYYPPI } from '#/src/constants';

export const getHakulomakeFieldsData = ({
  hakulomakeValues,
  kieleistykset,
  kieleistyksetSerialized,
}) => {
  const hakulomaketyyppi = _.get(hakulomakeValues, 'tyyppi') || null;

  const hakulomakeAtaruId =
    hakulomaketyyppi === HAKULOMAKETYYPPI.ATARU
      ? _.get(hakulomakeValues, 'lomake.value') || null
      : null;

  const hakulomakeLinkki =
    hakulomaketyyppi === HAKULOMAKETYYPPI.MUU
      ? kieleistykset(_.get(hakulomakeValues, 'linkki'))
      : {};

  const hakulomakeKuvaus =
    hakulomaketyyppi === HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA
      ? kieleistyksetSerialized(_.get(hakulomakeValues, 'kuvaus'))
      : {};

  return {
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  };
};
