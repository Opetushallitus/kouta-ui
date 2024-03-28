import { useMemo } from 'react';

import _ from 'lodash';
import { Field } from 'redux-form';

import { Box } from '#/src/components/virkailija';
import { OPETUSHALLITUS_ORGANISAATIO_OID } from '#/src/constants';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useOrganisaatio from '#/src/hooks/useOrganisaatio';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { useOrgCreateHierarkia } from '#/src/pages/HomePage/OrganisaatioDrawer/useReadableOrganisaatioHierarkia';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { flattenHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';

import { FormFieldSelect } from './formFields';

export const OrganisaatioSectionCreate = ({ organisaatioOid }) => {
  const language = useUserLanguage();
  const isOphVirkailija = useIsOphVirkailija();

  const { hierarkia, isLoading } = useOrgCreateHierarkia(organisaatioOid);

  const { organisaatio: oph, isLoading: ophIsLoading } = useOrganisaatio(
    OPETUSHALLITUS_ORGANISAATIO_OID
  );

  const options = useMemo(() => {
    const orgs = flattenHierarkia(hierarkia);

    if (isOphVirkailija && !ophIsLoading && oph) orgs.unshift(oph);

    return _.uniqBy(
      _.map(orgs, ({ oid, nimi }) => ({
        value: oid,
        label: `${getFirstLanguageValue(nimi, language)} (${oid})`,
      })),
      'value'
    );
  }, [hierarkia, language, isOphVirkailija, ophIsLoading, oph]);

  return (
    <Box>
      <Box {...getTestIdProps('organisaatioSelect')} mb={2}>
        <Field
          name="organisaatioOid"
          component={FormFieldSelect}
          options={options}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};
