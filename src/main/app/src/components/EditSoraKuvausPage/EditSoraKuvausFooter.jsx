import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Submit from '../Submit';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import getSoraKuvausByFormValues from '../../utils/getSoraKuvausByFormValues';
import updateSoraKuvaus from '../../utils/kouta/updateSoraKuvaus';
import useSaveForm from '../useSaveForm';
import validateSoraKuvausForm from '../../utils/validateSoraKuvausForm';

const EditSoraKuvausFooter = ({ soraKuvaus, history }) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateSoraKuvaus({
        httpClient,
        apiUrls,
        soraKuvaus: {
          ...soraKuvaus,
          ...getSoraKuvausByFormValues(values),
        },
      });

      history.replace({
        state: {
          soraKuvausUpdatedAt: Date.now(),
        },
      });
    },
    [soraKuvaus, history],
  );

  const { save } = useSaveForm({
    form: 'editSoraKuvausForm',
    submit,
    validate: validateSoraKuvausForm,
  });

  return (
    <Flex justifyEnd>
      <Submit onClick={save} {...getTestIdProps('tallennaSoraKuvausButton')}>
        {t('yleiset.tallenna')}
      </Submit>
    </Flex>
  );
};

export default withRouter(EditSoraKuvausFooter);
