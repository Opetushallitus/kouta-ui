import { mapValues } from 'lodash-es';

import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
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
  kuvaus: mapValues(hakulomakeKuvaus || {}, parseEditorState),
});
