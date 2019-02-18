import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Select from '../Select';
import Flex, { FlexItem } from '../Flex';
import { getFirstLanguageValue } from '../../utils';
import Typography from '../Typography';
import { getThemeProp, spacing } from '../../theme';
import Spacing from '../Spacing';
import KoulutuksetSection from './KoulutuksetSection';

const Container = styled.div`
  max-width: ${getThemeProp('contentMaxWidth')}
  margin: 0px auto;
  padding: ${spacing(3)};

`;

const getOrganisaatiotOptions = organisaatiot =>
  organisaatiot.map(({ oid, nimi }) => ({
    value: oid,
    label: getFirstLanguageValue(nimi),
  }));

const makeOnOrganisaatioChange = history => ({ value }) => {
  history.push(`/?organisaatioOid=${value}`);
};

const HomeContent = ({ organisaatiot, organisaatioOid, history }) => {
  const organisaatioOptions = getOrganisaatiotOptions(organisaatiot);

  const organisaatioValue = organisaatioOptions.find(
    ({ value }) => value === organisaatioOid,
  );

  return (
    <Container>
      <Flex marginBottom={3} justifyEnd>
        <FlexItem grow={0} basis="30rem">
          <Typography variant="h6" marginBottom={1}>
            Vaihda organisaatiota
          </Typography>
          <Select options={organisaatioOptions} value={organisaatioValue} onChange={makeOnOrganisaatioChange(history)} />
        </FlexItem>
      </Flex>
      <Typography variant="h3" marginBottom={3}>Koulutukset ja haut</Typography>
      <Spacing marginBottom={3}>
        <KoulutuksetSection organisaatioOid={organisaatioOid} />
      </Spacing>
    </Container>
  );
};

export default withRouter(
  HomeContent
);
