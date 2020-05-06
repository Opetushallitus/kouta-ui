import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Submit from '../Submit';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import createSoraKuvaus from '../../utils/kouta/createSoraKuvaus';
import validateSoraKuvausForm from '../../utils/validateSoraKuvausForm';
import getSoraKuvausByFormValues from '../../utils/getSoraKuvausByFormValues';

const CreateSoraKuvausFooter = ({ organisaatioOid }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { id } = await createSoraKuvaus({
        httpClient,
        apiUrls,
        soraKuvaus: { ...getSoraKuvausByFormValues(values), organisaatioOid },
      });

      history.push(
        `/organisaatio/${organisaatioOid}/sora-kuvaus/${id}/muokkaus`,
      );
    },
    [history, organisaatioOid],
  );

  const { save } = useSaveForm({
    form: 'createSoraKuvausForm',
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

export default CreateSoraKuvausFooter;
