import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Submit from '../Submit';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import useSaveForm from '../useSaveForm';
import createHaku from '../../utils/kouta/createHaku';
import validateHakuForm from '../../utils/validateHakuForm';
import getHakuByFormValues from '../../utils/getHakuByFormValues';

const CreateHakuFooter = ({ organisaatioOid, history }) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { oid } = await createHaku({
        httpClient,
        apiUrls,
        haku: { ...getHakuByFormValues(values), organisaatioOid },
      });

      history.push(`/organisaatio/${organisaatioOid}/haku/${oid}/muokkaus`);
    },
    [organisaatioOid, history],
  );

  const { save } = useSaveForm({
    form: 'createHakuForm',
    submit,
    validate: validateHakuForm,
  });

  return (
    <Flex justifyEnd>
      <Submit onClick={save} {...getTestIdProps('tallennaHakuButton')}>
        {t('yleiset.tallenna')}
      </Submit>
    </Flex>
  );
};

export default withRouter(CreateHakuFooter);
