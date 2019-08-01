import React from 'react';
import get from 'lodash/get';

import Box from '../Box';
import Button from '../Button';
import { JULKAISUTILA } from '../../constants';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import useSaveForm from '../useSaveForm';
import validateOppilaitoksenOsaForm from '../../utils/validateOppilaitoksenOsaForm';

const OppilaitoksenOsaPageFooter = ({
  oppilaitoksenOsa,
  oppilaitoksenOsaIsLoading = false,
}) => {
  const { t } = useTranslation();
  const tila = get(oppilaitoksenOsa, 'tila');

  const { save, saveAndPublish } = useSaveForm({
    form: 'oppilaitoksenOsa',
    submit: () => Promise.resolve(),
    validate: validateOppilaitoksenOsaForm,
  });

  return (
    <Box display="flex" justifyContent="end">
      <Button
        variant="outlined"
        onClick={save}
        disabled={oppilaitoksenOsaIsLoading}
        {...getTestIdProps('tallennaOppilaitoksenOsaButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
      {tila !== JULKAISUTILA.JULKAISTU ? (
        <Box ml={2}>
          <Button
            onClick={saveAndPublish}
            disabled={oppilaitoksenOsaIsLoading}
            {...getTestIdProps('tallennaJaJulkaiseOppilaitoksenOsaButton')}
          >
            {t('yleiset.tallennaJaJulkaise')}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default OppilaitoksenOsaPageFooter;
