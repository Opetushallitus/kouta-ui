import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Submit from '../Submit';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import useSaveForm from '../useSaveForm';
import createKoulutus from '../../utils/kouta/createKoulutus';
import validateKoulutusForm from '../../utils/validateKoulutusForm';
import getKoulutusByFormValues from '../../utils/getKoulutusByFormValues';

const CreateKoulutusFooter = ({ organisaatioOid, history }) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      const { oid } = await createKoulutus({
        httpClient,
        apiUrls,
        koulutus: { ...getKoulutusByFormValues(values), organisaatioOid },
      });

      history.push(`/organisaatio/${organisaatioOid}/koulutus/${oid}/muokkaus`);
    },
    [organisaatioOid, history],
  );

  const { save } = useSaveForm({
    form: 'createKoulutusForm',
    submit,
    validate: values => validateKoulutusForm({ ...values, organisaatioOid }),
  });

  return (
    <Flex justifyEnd>
      <Submit onClick={save} {...getTestIdProps('tallennaKoulutusButton')}>
        {t('yleiset.tallenna')}
      </Submit>
    </Flex>
  );
};

export default withRouter(CreateKoulutusFooter);
