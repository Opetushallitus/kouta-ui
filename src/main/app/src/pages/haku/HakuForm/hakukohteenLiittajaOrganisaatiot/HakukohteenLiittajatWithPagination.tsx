import { useCallback, useState, useEffect } from 'react';

import { difference, isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import Pagination from '#/src/components/Pagination';
import { Switch } from '#/src/components/Switch';
import { Box, Input, InputIcon } from '#/src/components/virkailija';
import { useFormIsDisabled } from '#/src/contexts/FormContext';
import { useItemsToShow } from '#/src/hooks/useItemsToShow';
import { Organisaatio } from '#/src/types/domainTypes';
import { searchOrgsFromHierarkiaWithName } from '#/src/utils/searchOrgsFromHierarkiaWithName';

export const PAGE_SIZE = 15;
export const countPageNumber = orgs => Math.ceil(orgs.length / PAGE_SIZE);

type Props = {
  liittajaOrganisaatiot: Array<Organisaatio>;
  value: Array<string>;
  onChange: (val: Array<string>) => void;
  language: LanguageCode;
};

export const HakukohteenLiittajatWithPagination = ({
  liittajaOrganisaatiot,
  value,
  onChange,
  language,
}: Props) => {
  const { t } = useTranslation();
  const readOnly = useFormIsDisabled();
  const [currentPage, setCurrentPage] = useState(0);
  const [usedNimi, setUsedNimi] = useState('');
  const [naytaVainValitut, setNaytaVainValitut] = useState(readOnly);
  const filteredLiittajaOrganisaatiot = useItemsToShow({
    organisaatiot: liittajaOrganisaatiot,
    value,
    naytaVainValitut,
  });
  let itemsToShow = filteredLiittajaOrganisaatiot;
  let pageCount = countPageNumber(itemsToShow);
  const currentPageFirstItemIndex = currentPage * PAGE_SIZE;

  if (!isEmpty(usedNimi)) {
    itemsToShow = searchOrgsFromHierarkiaWithName(
      filteredLiittajaOrganisaatiot,
      usedNimi,
      language
    );
    pageCount = countPageNumber(itemsToShow);
  }

  useEffect(() => {
    setCurrentPage(0);
  }, [usedNimi, naytaVainValitut]);

  const itemsOnPage = [
    itemsToShow.slice(
      currentPageFirstItemIndex,
      currentPageFirstItemIndex + PAGE_SIZE
    ),
  ].flat();

  const pageOids = itemsOnPage.map(org => org.oid);

  const onOrgsChange = useCallback(
    selectedPageOids => {
      onChange([...difference(value, pageOids), ...selectedPageOids]);
    },
    [value, pageOids, onChange]
  );

  return (
    <>
      <Box display="flex" alignItems="flex-start" flexDirection="column">
        <Box width={1} mb={2}>
          <Input
            disabled={readOnly}
            placeholder={t('hakulomake.haeOrganisaationNimella')}
            value={usedNimi}
            onChange={e => {
              setUsedNimi(e.target.value);
            }}
            suffix={<InputIcon type="search" />}
          />
        </Box>
        <Box mb={2}>
          <Switch
            disabled={readOnly}
            checked={readOnly ? true : naytaVainValitut}
            onChange={e => setNaytaVainValitut(e.target.checked)}
          >
            {t('hakulomake.naytaVainValitut')}
          </Switch>
        </Box>
      </Box>
      <Box marginBottom={2}>
        <OrganisaatioHierarkiaTreeSelect
          hierarkia={itemsOnPage}
          onChange={onOrgsChange}
          value={value}
          disableAutoSelect={false}
          getIsDisabled={() => readOnly}
        />
      </Box>
      <Pagination
        value={currentPage}
        onChange={setCurrentPage}
        pageCount={pageCount}
      />
    </>
  );
};
