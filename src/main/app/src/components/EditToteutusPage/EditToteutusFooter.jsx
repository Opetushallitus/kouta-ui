import React, { useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Button from '../Button';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import Flex from '../Flex';
import getToteutusByFormValues from '../../utils/getToteutusByFormValues';
import validateToteutusForm from '../../utils/validateToteutusForm';
import useSaveForm from '../useSaveForm';
import updateToteutus from '../../utils/kouta/updateToteutus';

const EditToteutusFooter = ({ toteutus, koulutustyyppi, history }) => {
  const { t } = useTranslation();

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateToteutus({
        httpClient,
        apiUrls,
        toteutus: {
          ...toteutus,
          ...getToteutusByFormValues({ ...values, koulutustyyppi }),
        },
      });

      history.replace({
        state: {
          toteutusUpdatedAt: Date.now(),
        },
      });
    },
    [toteutus, history, koulutustyyppi],
  );

  const { save } = useSaveForm({
    form: 'editToteutusForm',
    submit,
    validate: validateToteutusForm,
  });

  return (
    <Flex justifyEnd>
      <Button onClick={save} {...getTestIdProps('tallennaToteutusButton')}>
        {t('yleiset.tallenna')}
      </Button>
    </Flex>
  );
};

export default withRouter(EditToteutusFooter);
