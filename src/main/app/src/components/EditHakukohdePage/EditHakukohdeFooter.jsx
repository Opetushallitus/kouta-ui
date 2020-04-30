import React, { useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';

import Submit from '../Submit';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../utils';
import Box from '../Box';
import useSaveForm from '../useSaveForm';
import getHakukohdeByFormValues from '../../utils/getHakukohdeByFormValues';
import updateHakukohde from '../../utils/kouta/updateHakukohde';
import validateHakukohdeForm from '../../utils/validateHakukohdeForm';
import useOrganisaatio from '../useOrganisaatio';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { HAKUKOHDE_ROLE } from '../../constants';

const EditHakukohdeFooter = ({ hakukohde, history, haku, toteutus }) => {
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

  const { save } = useSaveForm({
    form: 'editHakukohdeForm',
    submit,
    validate: values => validateHakukohdeForm({ ...values, haku, toteutus }),
  });

  const { t } = useTranslation();

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

export default withRouter(EditHakukohdeFooter);
