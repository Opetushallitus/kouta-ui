import React, { useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Submit from '../Submit';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import Box from '../Box';
import { useSaveHakukohde } from '#/src/hooks/formSaveHooks';
import getHakukohdeByFormValues from '../../utils/getHakukohdeByFormValues';
import updateHakukohde from '../../utils/kouta/updateHakukohde';
import useOrganisaatio from '../useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { HAKUKOHDE_ROLE } from '../../constants';

const EditHakukohdeFooter = ({ hakukohde, haku, toteutus }) => {
  const { t } = useTranslation();
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
    <Box display="flex" justifyContent="flex-end">
      <Submit
        disabled={!canUpdate}
        onClick={save}
        title={!canUpdate ? t('hakukohdelomake.eiMuokkausOikeutta') : undefined}
        {...getTestIdProps('tallennaHakukohdeButton')}
      >
        {t('yleiset.tallenna')}
      </Submit>
    </Box>
  );
};

export default EditHakukohdeFooter;
