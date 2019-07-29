import React from 'react';

import Box from '../Box';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';

const OppilaitosPageFooter = ({ oppilaitos }) => {
  const { t } = useTranslation();
  const { tila } = oppilaitos;
  const save = () => {};
  const saveAndPublish = () => {};

  return (
    <Box display="flex" justifyContent="end">
      <Button
        variant="outlined"
        onClick={save}
        {...getTestIdProps('tallennaOppilaitosButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <Box ml={2}>
          <Button
            onClick={saveAndPublish}
            {...getTestIdProps('tallennaJaJulkaiseOppilaitosButton')}
          >
            {t('yleiset.tallennaJaJulkaise')}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default OppilaitosPageFooter;
