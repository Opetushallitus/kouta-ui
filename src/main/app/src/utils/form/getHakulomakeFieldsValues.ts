import _fp from 'lodash/fp';
import { parseEditorState } from '#/src/components/Editor/utils';
import { HAKULOMAKETYYPPI } from '#/src/constants';

export const getHakulomakeFieldsValues = ({
  hakulomaketyyppi,
  hakulomakeAtaruId,
  hakulomakeLinkki,
  hakulomakeKuvaus,
}) => ({
  tyyppi: hakulomaketyyppi,
  lomake:
    hakulomaketyyppi === HAKULOMAKETYYPPI.ATARU
      ? { value: hakulomakeAtaruId || '' }
      : {},
  linkki: hakulomakeLinkki || {},
  kuvaus: _fp.mapValues(parseEditorState, hakulomakeKuvaus || {}),
});
