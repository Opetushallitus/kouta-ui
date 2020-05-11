import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import getHakuByFormValues from '../../utils/getHakuByFormValues';
import updateHaku from '../../utils/kouta/updateHaku';
import { useSaveForm } from '#/src/hooks/formSaveHooks';
import validateHakuForm from '../../utils/validateHakuForm';
import useOrganisaatio from '../useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { HAKU_ROLE, ENTITY } from '../../constants';
import { FormFooter } from '#/src/components/FormPage';

const EditHakuFooter = ({ haku }) => {
  const history = useHistory();
  const { organisaatio } = useOrganisaatio(haku.organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const canUpdate = useMemo(() => {
    return roleBuilder.hasUpdate(HAKU_ROLE, organisaatio);
  }, [organisaatio, roleBuilder]);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateHaku({
        httpClient,
        apiUrls,
        haku: {
          ...haku,
          ...getHakuByFormValues(values),
        },
      });

      history.replace({
        state: {
          hakuUpdatedAt: Date.now(),
        },
      });
    },
    [haku, history]
  );

  const { save } = useSaveForm({
    form: 'editHakuForm',
    submit,
    validate: validateHakuForm,
  });

  return <FormFooter entity={ENTITY.HAKU} save={save} canUpdate={canUpdate} />;
};

export default EditHakuFooter;
