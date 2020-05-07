import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import updateValintaperuste from '../../utils/kouta/updateValintaperuste';
import getValintaperusteByFormValues from '../../utils/getValintaperusteByFormValues';
import useOrganisaatio from '../useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { VALINTAPERUSTE_ROLE, ENTITY } from '../../constants';
import { useSaveValintaperuste } from '#/src/hooks/formSaveHooks';
import { FormFooter } from '#/src/components/FormPage';

const EditValintaperusteFooter = ({ valintaperuste }) => {
  const history = useHistory();
  const { organisaatio } = useOrganisaatio(valintaperuste.organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const canUpdate = useMemo(() => {
    return roleBuilder.hasUpdate(VALINTAPERUSTE_ROLE, organisaatio);
  }, [organisaatio, roleBuilder]);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateValintaperuste({
        httpClient,
        apiUrls,
        valintaperuste: {
          ...valintaperuste,
          ...getValintaperusteByFormValues(values),
        },
      });

      history.replace({
        state: {
          valintaperusteUpdatedAt: Date.now(),
        },
      });
    },
    [valintaperuste, history],
  );

  const save = useSaveValintaperuste(submit);

  return (
    <FormFooter
      entity={ENTITY.VALINTAPERUSTE}
      save={save}
      canUpdate={canUpdate}
    />
  );
};

export default EditValintaperusteFooter;
