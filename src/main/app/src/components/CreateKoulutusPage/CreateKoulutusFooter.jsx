import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
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
    validate: values => validateKoulutusForm({...values, organisaatioOid}),
  });

  return (
    <Flex justifyEnd>
      <Button onClick={save} {...getTestIdProps('tallennaKoulutusButton')}>
        {t('yleiset.tallenna')}
      </Button>
    </Flex>
  );
};

export default withRouter(CreateKoulutusFooter);
