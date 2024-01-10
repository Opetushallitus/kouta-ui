import React, { useCallback, useState, useEffect } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import Pagination from '#/src/components/Pagination';
import { Switch } from '#/src/components/Switch';
import { Box, Input, InputIcon } from '#/src/components/virkailija';
import { useItemsToShow } from '#/src/hooks/useItemsToShow';
import { Organisaatio } from '#/src/types/domainTypes';
import { searchOrgsFromHierarkiaWithName } from '#/src/utils/searchOrgsFromHierarkiaWithName';

import { useResetAvoinTarjoajat } from './useResetAvoinTarjoajat';

export const PAGE_SIZE = 15;
export const countPageNumber = orgs => Math.ceil(orgs.length / PAGE_SIZE);

type Props = {
  organisaatioOid: string;
  tarjoajat: Array<Organisaatio>;
  value: Array<string>;
  onChange: (val: Array<string>) => void;
  language: LanguageCode;
  isAvoinKorkeakoulutus: boolean;
};

export const TarjoajatWithPagination = ({
  organisaatioOid,
  tarjoajat,
  value,
  onChange,
  language,
  isAvoinKorkeakoulutus,
}: Props) => {
  const { t } = useTranslation();
  const [currentPage, setPage] = useState(0);
  const [usedNimi, setNimi] = useState('');
  const [naytaVainValitut, setNaytaVainValitut] = useState(false);
  const filteredTarjoajat = useItemsToShow({
    organisaatiot: tarjoajat,
    value,
    naytaVainValitut,
  });
  let itemsToShow = filteredTarjoajat;
  let pageCount = countPageNumber(itemsToShow);
  const currentPageFirstItemIndex = currentPage * PAGE_SIZE;

  if (!_.isEmpty(usedNimi)) {
    itemsToShow = searchOrgsFromHierarkiaWithName(
      filteredTarjoajat,
      usedNimi,
      language
    );
    pageCount = countPageNumber(itemsToShow);
  }

  useEffect(() => {
    setPage(0);
  }, [usedNimi, isAvoinKorkeakoulutus, naytaVainValitut]);

  useResetAvoinTarjoajat({
    isAvoinKorkeakoulutus,
    organisaatioOid,
    value,
    onChange,
  });

  const itemsOnPage = [
    itemsToShow.slice(
      currentPageFirstItemIndex,
      currentPageFirstItemIndex + PAGE_SIZE
    ),
  ].flat();

  const pageOids = itemsOnPage.map(org => org.oid);

  const onOrgsChange = useCallback(
    selectedPageOids => {
      onChange([..._.difference(value, pageOids), ...selectedPageOids]);
    },
    [value, pageOids, onChange]
  );

  return (
    <>
      <Box display="flex" alignItems="flex-start" flexDirection="column">
        <Box width={1} mb={2}>
          <Input
            placeholder={t('koulutuslomake.haeJarjestajanNimella')}
            value={usedNimi}
            onChange={e => {
              setNimi(e.target.value);
            }}
            suffix={<InputIcon type="search" />}
          />
        </Box>
        <Box mb={2}>
          <Switch
            checked={naytaVainValitut}
            onChange={e => setNaytaVainValitut(e.target.checked)}
          >
            {t('koulutuslomake.naytaVainValitut')}
          </Switch>
        </Box>
      </Box>
      <Box marginBottom={2}>
        <OrganisaatioHierarkiaTreeSelect
          hierarkia={itemsOnPage}
          onChange={onOrgsChange}
          value={value}
          disableAutoSelect={true}
        />
      </Box>
      <Pagination
        value={currentPage}
        onChange={setPage}
        pageCount={pageCount}
      />
    </>
  );
};
