import _fp from 'lodash/fp';

import { parseEditorState } from '#/src/components/Editor/utils';
import { HAKULOMAKETYYPPI } from '#/src/constants';
import { HakulomakeFormSection } from '#/src/types/hakuTypes';

export const getHakulomakeFieldsValues = ({
  hakulomaketyyppi,
  hakulomakeAtaruId,
  hakulomakeLinkki,
  hakulomakeKuvaus,
}): HakulomakeFormSection => ({
  tyyppi: hakulomaketyyppi,
  lomake:
    hakulomaketyyppi === HAKULOMAKETYYPPI.ATARU
      ? { value: hakulomakeAtaruId || '' }
      : {},
  linkki: hakulomakeLinkki || {},
  kuvaus: _fp.mapValues(parseEditorState, hakulomakeKuvaus || {}),
});
