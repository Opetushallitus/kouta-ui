import React, { useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useSaveHakukohde } from '#/src/hooks/formSaveHooks';
import getHakukohdeByFormValues from '../../utils/getHakukohdeByFormValues';
import updateHakukohde from '../../utils/kouta/updateHakukohde';
import useOrganisaatio from '../useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { HAKUKOHDE_ROLE, ENTITY } from '#/src/constants';
import { FormFooter } from '#/src/components/FormPage';

const EditHakukohdeFooter = ({ hakukohde, haku, toteutus }) => {
  const history = useHistory();

  const { organisaatio } = useOrganisaatio(hakukohde.organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const canUpdate = useMemo(() => {
    return roleBuilder.hasUpdate(HAKUKOHDE_ROLE, organisaatio);
  }, [organisaatio, roleBuilder]);

  const submit = useCallback(
    async ({ values, httpClient, apiUrls }) => {
      await updateHakukohde({
        httpClient,
        apiUrls,
        hakukohde: {
          ...hakukohde,
          ...getHakukohdeByFormValues(values),
        },
      });

      history.replace({
        state: {
          hakukohdeUpdatedAt: Date.now(),
        },
      });
    },
    [hakukohde, history],
  );

  const save = useSaveHakukohde(submit, { haku, toteutus });

  return (
    <FormFooter entity={ENTITY.HAKUKOHDE} save={save} canUpdate={canUpdate} />
  );
};

export default EditHakukohdeFooter;
