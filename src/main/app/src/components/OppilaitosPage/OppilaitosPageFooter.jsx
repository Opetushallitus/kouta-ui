import React from 'react';

import Box from '../Box';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import useSaveForm from '../useSaveForm';
import validateOppilaitosForm from '../../utils/validateOppilaitosForm';

const OppilaitosPageFooter = ({ oppilaitos, oppilaitosIsLoading = false }) => {
  const { t } = useTranslation();
  const { tila } = oppilaitos;

  const { save, saveAndPublish } = useSaveForm({
    submit: () => Promise.resolve(),
    validate: validateOppilaitosForm,
  });

  return (
    <Box display="flex" justifyContent="end">
      <Button
        variant="outlined"
        onClick={save}
        disabled={oppilaitosIsLoading}
        {...getTestIdProps('tallennaOppilaitosButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <Box ml={2}>
          <Button
            onClick={saveAndPublish}
            disabled={oppilaitosIsLoading}
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
