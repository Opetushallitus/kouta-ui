import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';

import Typography from '../../Typography';
import KoulutusSelect from '../KoulutusSelect';
import ApiAsync from '../../ApiAsync';
import { getKoulutusByKoodi } from '../../../apiUtils';
import { getThemeProp } from '../../../theme';
import { getLanguageValue, getTestIdProps } from '../../../utils';
import useTranslation from '../../useTranslation';

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

const getKoulutus = args => getKoulutusByKoodi(args);

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

const nop = () => {};

const renderSelectField = ({ input, koulutusTyyppi, ...props }) => {
  return (
    <KoulutusSelect
      {...input}
      koulutusTyyppi={koulutusTyyppi}
      {...props}
      onBlur={nop}
    />
  );
};

const KoulutusInfo = ({ koulutus, language = 'fi' }) => {
  const { t } = useTranslation();
  const { opintojenlaajuus } = koulutus;

  const {
    nimikkeet,
    osaamisalat,
    koulutusala,
    opintojenlaajuusYksikko,
    nimi,
  } = useMemo(
    () => ({
      nimikkeet: getTutkintonimikkeet({ koulutus, language }),
      osaamisalat: getOsaamisalat({ koulutus, language }),
      koulutusala: getLanguageValue(koulutus.koulutusala, language),
      opintojenlaajuusYksikko: getLanguageValue(
        koulutus.opintojenlaajuusYksikko,
        language,
      ),
      nimi: getLanguageValue(koulutus.nimi, language),
    }),
    [koulutus, language],
  );

  return (
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
  );
};

const InformationAsync = ({ koodiUri, language = 'fi' }) => (
  <ApiAsync promiseFn={getKoulutus} koodiUri={koodiUri} watch={koodiUri}>
    {({ data }) =>
      data ? <KoulutusInfo koulutus={data} language={language} /> : null
    }
  </ApiAsync>
);

const AmmatillinenTiedotSection = ({
  koulutustyyppi,
  language,
  koulutusValue,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        {t('koulutuslomake.valitseKoulutus')}
      </Typography>
      <Container>
        <Content>
          <div {...getTestIdProps('koulutustyyppiSelect')}>
            <Field
              name="koulutus"
              component={renderSelectField}
              koulutusTyyppi={koulutustyyppi}
            />
          </div>
        </Content>
        <InfoContent>
          {koulutusValue ? (
            <InformationAsync
              koodiUri={koulutusValue.value}
              language={language}
            />
          ) : null}
        </InfoContent>
      </Container>
    </>
  );
};

export default AmmatillinenTiedotSection;
