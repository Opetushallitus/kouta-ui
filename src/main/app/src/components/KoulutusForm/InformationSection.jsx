import React from 'react';
import styled from 'styled-components';
import { Field, formValues } from 'redux-form';

import LanguageSelector from '../LanguageSelector';
import Typography from '../Typography';
import KoulutusSelect from '../KoulutusSelect';
import ApiAsync from '../ApiAsync';
import { getKoulutusByKoodi } from '../../apiUtils';
import { getThemeProp } from '../../theme';
import { getLanguageValue } from '../../utils';

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
  return <KoulutusSelect {...input} koulutusTyyppi={koulutusTyyppi} {...props} onBlur={nop} />
};

const ActiveKoulutus = formValues({
  koulutus: 'koulutus',
})(({ koulutus, children }) => children({ koulutus: koulutus || null }));

const KoulutusInfo = ({ koulutus, language = 'fi' }) => {
  const { opintojenlaajuus } = koulutus;
  const nimikkeet = getTutkintonimikkeet({ koulutus, language });
  const osaamisalat = getOsaamisalat({ koulutus, language });
  const koulutusala = getLanguageValue(koulutus.koulutusala, language);
  const opintojenlaajuusYksikko = getLanguageValue(
    koulutus.opintojenlaajuusYksikko,
    language,
  );
  const nimi = getLanguageValue(koulutus.nimi, language);

  return (
    <Typography>
      <Row>
        <LabelColumn>Koulutus:</LabelColumn>
        <ContentColumn>{nimi}</ContentColumn>
      </Row>
      <Row>
        <LabelColumn>Koulutusala:</LabelColumn>
        <ContentColumn>{koulutusala}</ContentColumn>
      </Row>
      <Row>
        <LabelColumn>Osaamisalat:</LabelColumn>
        <ContentColumn>{osaamisalat.join(', ')}</ContentColumn>
      </Row>
      <Row>
        <LabelColumn>Tutkintonimike:</LabelColumn>
        <ContentColumn>{nimikkeet.join(', ')}</ContentColumn>
      </Row>
      <Row>
        <LabelColumn>Laajuus:</LabelColumn>
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

const InformationSection = ({ languages = [], koulutusTyyppi,  disabled = false, ...props }) => {
  return (
    <div {...props}>
      <LanguageSelector languages={languages} defaultValue="fi">
        {({ value }) => (
          <>
            <Typography variant="h6" marginBottom={1}>
              Valitse koulutus listasta
            </Typography>
            <Container>
              <ActiveKoulutus>
                {({ koulutus }) => (
                  <>
                    <Content>
                      <Field
                        name="koulutus"
                        component={renderSelectField}
                        koulutusTyyppi={koulutusTyyppi}
                        isDisabled={disabled}
                      />
                    </Content>
                    <InfoContent>
                      {koulutus ? (
                        <InformationAsync
                          koodiUri={koulutus.value}
                          language={value}
                        />
                      ) : null}
                    </InfoContent>
                  </>
                )}
              </ActiveKoulutus>
            </Container>
          </>
        )}
      </LanguageSelector>
    </div>
  );
};

export default InformationSection;
