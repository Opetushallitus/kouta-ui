import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import getKoulutusByFormValues from '../../utils/getKoulutusByFormValues';
import updateKoulutus from '../../utils/kouta/updateKoulutus';
import useSaveForm from '../useSaveForm';
import validateKoulutusForm from '../../utils/validateKoulutusForm';

const EditKoulutusFooter = ({ koulutus, history }) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateKoulutus({
        httpClient,
        apiUrls,
        koulutus: {
          ...koulutus,
          ...getKoulutusByFormValues(values),
        },
      });

      history.replace({
        state: {
          koulutusUpdatedAt: Date.now(),
        },
      });
    },
    [koulutus, history],
  );

  const { save } = useSaveForm({
    form: 'editKoulutusForm',
    submit,
    validate: validateKoulutusForm,
  });

  return (
    <Flex justifyEnd>
      <Button
        variant="outlined"
        onClick={save}
        {...getTestIdProps('tallennaKoulutusButton')}
      >
        {t('yleiset.tallenna')}
      </Button>
    </Flex>
  );
};

export default withRouter(EditKoulutusFooter);
