import React from 'react';

import ListCollapse from '../ListCollapse';

import useTranslation from '../../useTranslation';
import useInView from '../../useInView';
import NavigationAnchor from '../NavigationAnchor';
import Button from '../../Button';
import useModal from '../../useModal';
import LiitoksetModal from './LiitoksetModal';

const Actions = ({ organisaatioOid }) => {
  const { isOpen, close, open } = useModal();
  const { t } = useTranslation();

  return (
    <>
      <LiitoksetModal
        open={isOpen}
        organisaatioOid={organisaatioOid}
        onClose={close}
      />
      <Button onClick={open}>{t('etusivu.luoUusiHakukohde')}</Button>
    </>
  );
};

const HakukohteetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const [ref] = useInView({ threshold: 0.25, triggerOnce: true });

  return (
    <>
      <NavigationAnchor id="hakukohteet" />
      <ListCollapse
        icon="grain"
        header={t('yleiset.hakukohteet')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <div ref={ref} />
      </ListCollapse>
    </>
  );
};

export default HakukohteetSection;
