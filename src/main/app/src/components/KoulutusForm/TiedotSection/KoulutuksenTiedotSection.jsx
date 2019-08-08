import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';

import Typography from '../../Typography';
import KoulutusSelect from '../KoulutusSelect';
import { getKoulutusByKoodi } from '../../../apiUtils';
import { getThemeProp } from '../../../theme';
import { getLanguageValue, getTestIdProps, noop } from '../../../utils';
import useTranslation from '../../useTranslation';
import { createFormFieldComponent } from '../../FormFields';
import useApiAsync from '../../useApiAsync';

const getTutkintonimikkeet = ({ koulutus, language }) => {
  const { tutkintonimikeKoodit = [] } = koulutus;

  return tutkintonimikeKoodit
    .map(({ nimi }) => getLanguageValue(nimi, language))
    .filter(name => !!name);
};

const getOsaamisalat = ({ koulutus, language }) => {
  const { osaamisalat = [] } = koulutus;

  return osaamisalat
    .map(({ nimi }) => getLanguageValue(nimi, language))
    .filter(name => !!name);
};

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
`;

const Row = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const LabelColumn = styled.div`
  width: 30%;
  padding-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const ContentColumn = styled.div`
  flex: 1;
`;

const InfoContent = styled(Content)`
  padding-left: ${({ theme }) => theme.spacing.unit * 3}px;
  ${getThemeProp('typography.body')};
`;

const KoulutusField = createFormFieldComponent(
  KoulutusSelect,
  ({ input, ...props }) => ({
    ...input,
    onBlur: noop,
    ...props,
  }),
);

const KoulutusInfo = ({ koulutusKoodiUri, language = 'fi' }) => {
  const { t } = useTranslation();

  const { data: koulutus } = useApiAsync({
    promiseFn: getKoulutusByKoodi,
    koodiUri: koulutusKoodiUri,
    watch: koulutusKoodiUri,
  });

  const {
    nimikkeet,
    osaamisalat,
    koulutusala,
    opintojenlaajuus,
    opintojenlaajuusYksikko,
    nimi,
  } = useMemo(
    () => ({
      nimikkeet: koulutus ? getTutkintonimikkeet({ koulutus, language }) : [],
      osaamisalat: koulutus ? getOsaamisalat({ koulutus, language }) : [],
      koulutusala: koulutus
        ? getLanguageValue(koulutus.koulutusala, language)
        : undefined,
      opintojenlaajuusYksikko: koulutus
        ? getLanguageValue(koulutus.opintojenlaajuusYksikko, language)
        : undefined,
      nimi: koulutus ? getLanguageValue(koulutus.nimi, language) : undefined,
      opintojenlaajuus: koulutus ? koulutus.opintojenlaajuus : undefined,
    }),
    [koulutus, language],
  );

  return koulutus ? (
    <Typography>
      <Row>
        <LabelColumn>{t('yleiset.koulutus')}:</LabelColumn>
        <ContentColumn>{nimi}</ContentColumn>
      </Row>
      <Row>
        <LabelColumn>{t('yleiset.koulutusala')}:</LabelColumn>
        <ContentColumn>{koulutusala}</ContentColumn>
      </Row>
      <Row>
        <LabelColumn>{t('yleiset.osaamisalat')}:</LabelColumn>
        <ContentColumn>{osaamisalat.join(', ')}</ContentColumn>
      </Row>
      <Row>
        <LabelColumn>{t('yleiset.tutkintonimike')}:</LabelColumn>
        <ContentColumn>{nimikkeet.join(', ')}</ContentColumn>
      </Row>
      <Row>
        <LabelColumn>{t('yleiset.laajuus')}:</LabelColumn>
        <ContentColumn>
          {opintojenlaajuus} {opintojenlaajuusYksikko}
        </ContentColumn>
      </Row>
    </Typography>
  ) : null;
};

const KoulutuksenTiedotSection = ({
  koulutustyyppi,
  language,
  koulutuskoodi,
  name,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Container>
        <Content>
          <div {...getTestIdProps('koulutustyyppiSelect')}>
            <Field
              name={`${name}.koulutus`}
              component={KoulutusField}
              koulutusTyyppi={koulutustyyppi}
              label={t('koulutuslomake.valitseKoulutus')}
            />
          </div>
        </Content>
        <InfoContent>
          {koulutuskoodi ? (
            <KoulutusInfo
              koulutusKoodiUri={koulutuskoodi.value}
              language={language}
            />
          ) : null}
        </InfoContent>
      </Container>
    </>
  );
};

export default KoulutuksenTiedotSection;
