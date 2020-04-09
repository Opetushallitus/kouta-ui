import React from 'react';
import _fp from 'lodash/fp';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getLanguageValue } from '#/src/utils';
import { getEPerusteById } from '#/src/apiUtils';
import Typography from '#/src/components/Typography';
import useApiAsync from '#/src/components/useApiAsync';
import useFieldValue from '#/src/components/useFieldValue';

const StyledKuvaus = styled.div(({ theme }) => ({
  ..._fp.compose(
    _fp.mapValues(headingStyle => ({
      ...headingStyle,
      marginBottom: 0,
      marginTop: '20px',
    })),
    _fp.pick(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
    _fp.get('typography'),
  )(theme),
  ..._fp.get(theme, 'typography.body'),
  maxWidth: '750px',
}));

const TekstiKuvausSection = ({ language }) => {
  const ePerusteField = useFieldValue('information.eperuste');
  const ePerusteId = _fp.get('value', ePerusteField);
  const { t } = useTranslation();

  const { data = {} } = useApiAsync({
    promiseFn: getEPerusteById,
    ePerusteId,
    watch: ePerusteId,
  });

  const { kuvaus, nimi, diaarinumero } = data;

  const translatedKuvaus = getLanguageValue(kuvaus, language);
  const translatedNimi = getLanguageValue(nimi, language);

  return (
    <>
      {kuvaus ? (
        <>
          <Typography variant="h5" marginBottom="20px">
            {translatedNimi}{' '}
            <Typography as="span" variant="body">
              ({diaarinumero})
            </Typography>
          </Typography>
          <StyledKuvaus
            dangerouslySetInnerHTML={{
              __html: translatedKuvaus,
            }}
          ></StyledKuvaus>
          <Typography variant="secondary" as="div" marginTop={1}>
            ({t('yleiset.lahde')}: {t('yleiset.ePerusteet')})
          </Typography>
        </>
      ) : (
        <Typography variant="secondary" as="div">
          {t('koulutuslomake.kuvausEiOleSaatavilla')}
        </Typography>
      )}
    </>
  );
};

export default TekstiKuvausSection;
