import _ from 'lodash';
import { HAKULOMAKETYYPPI } from '#/src/constants';
import { serializeEditorState } from '#/src/components/Editor/utils';

export const getHakulomakeFieldsData = ({ hakulomakeValues, kielivalinta }) => {
  const hakulomaketyyppi = _.get(hakulomakeValues, 'tyyppi') || null;

  const hakulomakeAtaruId =
    hakulomaketyyppi === HAKULOMAKETYYPPI.ATARU
      ? _.get(hakulomakeValues, ['lomake', 'value']) || null
      : null;

  const hakulomakeLinkki =
    hakulomaketyyppi === HAKULOMAKETYYPPI.MUU
      ? _.pick(_.get(hakulomakeValues, 'linkki') || {}, kielivalinta)
      : {};

  const hakulomakeKuvaus =
    hakulomaketyyppi === HAKULOMAKETYYPPI.EI_SAHKOISTA_HAKUA
      ? _.mapValues(
          _.pick(_.get(hakulomakeValues, 'kuvaus') || {}, kielivalinta),
          serializeEditorState
        )
      : {};

  return {
    hakulomaketyyppi,
    hakulomakeAtaruId,
    hakulomakeLinkki,
    hakulomakeKuvaus,
  };
};
