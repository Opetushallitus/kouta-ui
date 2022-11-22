import React, { useState } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { createFormFieldComponent } from '#/src/components/formFields';
import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import Pagination from '#/src/components/Pagination';
import { Box, Input, InputIcon } from '#/src/components/virkailija';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus from '#/src/hooks/useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus';
import { getTestIdProps } from '#/src/utils';

const NUM_OF_ITEMS_ON_PAGE = 10;
const countPageNumber = orgs => Math.ceil(orgs.length / NUM_OF_ITEMS_ON_PAGE);

const JarjestajatWithPagination = ({
  hierarkia,
  value,
  onChange,
  language,
}) => {
  const [currentPage, setPage] = useState(0);
  const [usedNimi, setNimi] = useState('');
  let itemsToShow = hierarkia || [];
  let itemsOnPage = [];
  let pageCount = countPageNumber(hierarkia || []);
  const currentPageFirstItemIndex = currentPage * NUM_OF_ITEMS_ON_PAGE;

  if (!_.isEmpty(usedNimi)) {
    const foundOrgs = hierarkia.filter(org => {
      const regex = new RegExp(`${usedNimi}.+`, 'gmi');
      return org.nimi[language]
        ? org.nimi[language].match(regex)
        : org.nimi.fi.match(regex);
    });

    pageCount = countPageNumber(foundOrgs);
    itemsToShow = foundOrgs;
  }

  itemsOnPage = [
    itemsToShow.slice(
      currentPageFirstItemIndex,
      currentPageFirstItemIndex + NUM_OF_ITEMS_ON_PAGE
    ),
  ].flat();

  const oids = item => {
    if (item) {
      if (_.isEmpty(item.children)) {
        return [item.oid];
      }

      return [item.oid, ...item.children.map(oids).flat()];
    }

    return [];
  };

  const pageOids = itemsOnPage.map(oids).flat();

  return (
    <>
      <Box display="flex" alignItems="center">
        <Box width={1} marginBottom={2}>
          <Input
            placeholder={'Hae'}
            value={usedNimi}
            onChange={e => {
              setNimi(e.target.value);
            }}
            suffix={<InputIcon type="search" />}
          />
        </Box>
      </Box>
      <Box marginBottom={2}>
        <OrganisaatioHierarkiaTreeSelect
          hierarkia={itemsOnPage}
          onChange={selectedPageOids => {
            onChange([
              ...value.filter(oid => !pageOids.includes(oid)),
              ...selectedPageOids,
            ]);
          }}
          value={value}
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

const JarjestajatField = createFormFieldComponent(
  JarjestajatWithPagination,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  })
);

export const JarjestajaSectionForKkOpintojaksoAndOpintokokonaisuus = ({
  organisaatioOid,
  koulutus,
  disableTarjoajaHierarkia,
}) => {
  const { t } = useTranslation();
  const language = useLanguageTab();

  const { organisaatiot } =
    useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus(language);

  return (
    <div {...getTestIdProps('jarjestajatSelection')}>
      {organisaatiot && (
        <Field
          name={`tarjoajat.tarjoajat`}
          hierarkia={organisaatiot}
          component={JarjestajatField}
          language={language}
          label={t(
            'koulutuslomake.valitseOpintojaksonTaiKokonaisuudenJarjestajat'
          )}
        />
      )}
    </div>
  );
};
