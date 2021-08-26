import { useCallback, useMemo } from 'react';

import _ from 'lodash';
import { Field } from 'redux-form';

import { Box } from '#/src/components/virkailija';
import { useHttpClient } from '#/src/contexts/HttpClientContext';
import { useUrls } from '#/src/contexts/UrlContext';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import useLoadOptions from '#/src/hooks/useLoadOptions';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import getOrganisaatioByOid from '#/src/utils/organisaatio/getOrganisaatioByOid';
import { flattenHierarkia } from '#/src/utils/organisaatio/hierarkiaHelpers';

import { OPETUSHALLITUS_ORGANISAATIO_OID } from '../constants';
import { FormFieldAsyncSelect } from './formFields';

export const OrganisaatioSection = () => {
  const language = useUserLanguage();
  const isOphVirkailija = useIsOphVirkailija();

  const { hierarkia, isLoading } = useOrganisaatioHierarkia(
    OPETUSHALLITUS_ORGANISAATIO_OID,
    {
      skipParents: true,
      enabled: isOphVirkailija,
    }
  );

  const options = useMemo(() => {
    const orgs = flattenHierarkia(hierarkia);
    return _.map(orgs, ({ oid, nimi }) => ({
      value: oid,
      label: `${getFirstLanguageValue(nimi, language)} (${oid})`,
    }));
  }, [hierarkia, language]);

  const loadOptions = useLoadOptions(options);

  const apiUrls = useUrls();
  const httpClient = useHttpClient();

  const loadLabel = useCallback(
    async oid => {
      const organisaatio = await getOrganisaatioByOid({
        oid,
        httpClient,
        apiUrls,
      });
      return `${getFirstLanguageValue(organisaatio?.nimi, language)} (${
        organisaatio?.oid
      })`;
    },
    [apiUrls, httpClient, language]
  );

  return (
    <Box>
      <Box mb={2}>
        <Field
          name="organisaatioOid"
          component={FormFieldAsyncSelect}
          loadOptions={loadOptions}
          loadLabel={loadLabel}
          disabled={!isOphVirkailija}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};
