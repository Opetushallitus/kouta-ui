import React, { useState } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { createFormFieldComponent } from '#/src/components/formFields';
import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import Pagination from '#/src/components/Pagination';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus from '#/src/hooks/useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus';
import { getTestIdProps } from '#/src/utils';

const JarjestajatWithPagination = ({ hierarkia, value, onChange }) => {
  const [currentPage, setPage] = useState(0);
  const numOfItemsOnPage = 10;
  const pageCount = Math.ceil(hierarkia.length / numOfItemsOnPage);
  const currentPageFirstItemIndex = currentPage * numOfItemsOnPage;

  const itemsOnPage = hierarkia.slice(
    currentPageFirstItemIndex,
    currentPageFirstItemIndex + numOfItemsOnPage
  );

  const oids = item => {
    if (_.isEmpty(item.children)) {
      return [item.oid];
    }

    return [item.oid, ...item.children.map(oids).flat()];
  };

  const pageOids = itemsOnPage.map(oids).flat();
  return (
    <>
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
  const selectedLanguage = useLanguageTab();

  const { organisaatiot } =
    useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus(selectedLanguage);

  return (
    <div {...getTestIdProps('jarjestajatSelection')}>
      {organisaatiot && (
        <Field
          name={`tarjoajat.tarjoajat`}
          hierarkia={organisaatiot}
          component={JarjestajatField}
          label={t(
            'koulutuslomake.valitseOpintojaksonTaiKokonaisuudenJarjestajat'
          )}
        />
      )}
    </div>
  );
};
