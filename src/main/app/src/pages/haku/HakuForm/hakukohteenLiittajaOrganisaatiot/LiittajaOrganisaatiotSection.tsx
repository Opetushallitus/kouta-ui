import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

// import { Alert } from '#/src/components/Alert';
import {
  createFormFieldComponent,
  // FormFieldCheckbox,
  simpleMapProps,
} from '#/src/components/formFields';
import { Box, Spin } from '#/src/components/virkailija';
import { HAKU_ROLE } from '#/src/constants';
// import { useFieldValue } from '#/src/hooks/form';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';

import { HakukohteenLiittajatWithPagination } from './HakukohteenLiittajatWithPagination';
import { LiittajaOrganisaatiotLinkList } from './LiittajaOrgaisaatiotLinkList';
import { useSelectableLiittajaOrganisaatiot } from './useSelectableHakukohteenLiittajaOrganisaatiot';

const LiittajatFormField = createFormFieldComponent(
  HakukohteenLiittajatWithPagination,
  simpleMapProps
);

const LiittajaOrganisaatiotSelector = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  const { liittajaOrganisaatiot, isLoading } =
    useSelectableLiittajaOrganisaatiot();

  const roleBuilder = useAuthorizedUserRoleBuilder();

  const getIsDisabled = useCallback(
    organisaatio => {
      return !roleBuilder.hasUpdate(HAKU_ROLE, organisaatio).result();
    },
    [roleBuilder]
  );

  return isLoading ? (
    <Spin />
  ) : (
    <div>
      <Field
        name="hakukohteenLiittajaOrganisaatiot"
        liittajaOrganisaatiot={liittajaOrganisaatiot}
        getIsDisabled={getIsDisabled}
        component={LiittajatFormField}
        label={t('hakulomake.valitseLiittajaOrganisaatiot')}
        organisaatioOid={organisaatioOid}
      />
    </div>
  );
};

export const LiittajaOrganisaatiotSection = ({ organisaatioOid, haku }) => {
  // const { t } = useTranslation();

  // const koulutusTarjoajaOids = haku?.hakukohteenLiittajaOrganisaatiot ?? [];
  const isOphVirkailija = useIsOphVirkailija();

  // const tarjoajatFromPohja = useFieldValue('pohja.tarjoajat');
  // const kaytaPohjanJarjestajaa = useFieldValue(
  //   'tarjoajat.kaytaPohjanJarjestajaa'
  // );

  return (
    <>
      {isOphVirkailija && (
        <Box mb={2}>
          <LiittajaOrganisaatiotLinkList haku={haku} />
        </Box>
      )}
      <LiittajaOrganisaatiotSelector organisaatioOid={organisaatioOid} />
    </>
  );
};
