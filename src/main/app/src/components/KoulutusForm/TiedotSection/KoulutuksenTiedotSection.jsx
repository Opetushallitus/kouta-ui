import React, { useMemo, useEffect, useContext } from 'react';
import { find, isEmpty, isNil, get, map } from 'lodash';
import { Field } from 'redux-form';
import styled, { css } from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';
import { FormFieldSelect } from '../../formFields';
import Typography from '../../Typography';
import KoulutusField from '../KoulutusField';
import { getKoulutusByKoodi } from '../../../apiUtils';
import { getLanguageValue, getTestIdProps } from '../../../utils';
import useTranslation from '../../useTranslation';
import useApiAsync from '../../useApiAsync';
import Box from '../../Box';
import UrlContext from '../../UrlContext';
import { setLightness } from 'polished';
import {
  useBoundFormActions,
  useBoundFormSelectors,
} from '../../../hooks/form';
import useFieldValue from '../../useFieldValue';
import { getReadableDateTime } from '../../../utils';
import { getThemeProp } from '../../../theme';
import Anchor from '../../Anchor';
import {
  EPERUSTE_STATUS_TULEVA,
  EPERUSTE_STATUS_VOIMASSA,
} from '../../../constants';

const getStatusColors = ({ status, theme }) => {
  switch (status) {
    case EPERUSTE_STATUS_TULEVA:
      return {
        backgroundColor: setLightness(0.9, theme.palette.success.main),
        color: theme.palette.success.main,
      };
    case EPERUSTE_STATUS_VOIMASSA:
      return {
        backgroundColor: setLightness(0.9, theme.palette.primary.main),
        color: theme.palette.primary.main,
      };
    default:
      return {
        backgroundColor: 'inherit',
        color: 'inherit',
      };
  }
};

const getStatusCss = ({ status, theme }) => {
  const { backgroundColor, color } = getStatusColors({ status, theme });
  return css`
    background-color: ${backgroundColor};
    color: ${color};
  `;
};

const getPerusteetOptions = (perusteet, language) => {
  return map(perusteet, ({ id, nimi, diaarinumero }) => ({
    label: `${getLanguageValue(nimi, language)} (${diaarinumero})`,
    value: id,
  }));
};

const getStatus = perusteet => {
  if (perusteet) {
    const { voimassaoloAlkaa, voimassaoloLoppuu } = perusteet;
    const now = Date.now();
    if (
      voimassaoloAlkaa &&
      voimassaoloAlkaa < now &&
      (isNil(voimassaoloLoppuu) || voimassaoloLoppuu > now)
    ) {
      return EPERUSTE_STATUS_VOIMASSA;
    } else if (voimassaoloAlkaa > now) {
      return EPERUSTE_STATUS_TULEVA;
    }
  }
};

const getTutkintonimikkeet = ({ peruste = {}, language }) => {
  const { tutkintonimikeKoodit = [] } = peruste;

  return tutkintonimikeKoodit
    .map(({ nimi }) => getLanguageValue(nimi, language))
    .filter(name => !!name);
};

const getOsaamisalat = ({ peruste = {}, language }) => {
  const { osaamisalat = [] } = peruste;

  return osaamisalat
    .map(({ nimi }) => getLanguageValue(nimi, language))
    .filter(name => !!name);
};

const PerusteField = props => {
  const { perusteet, language } = props;
  const { t } = useTranslation();
  const perusteetOptions = useMemo(
    () => getPerusteetOptions(perusteet, language),
    [perusteet, language],
  );

  return (
    <Field
      component={FormFieldSelect}
      label={t('koulutuslomake.valitseKaytettavaEperuste')}
      options={perusteetOptions}
      isDisabled={isNil(perusteet) || isEmpty(perusteet)}
      {...props}
    />
  );
};

const InfoRow = ({ title, description, suffix }) => {
  return (
    <React.Fragment>
      <Cell key="title-cell">
        <Typography color="text.dark">{title}:</Typography>
      </Cell>
      <Cell key="description-cell">
        <Typography>
          {isNil(description) || get(description, 'length') === 0
            ? '-'
            : description}
          {description && suffix ? ` ${suffix}` : ''}
        </Typography>
      </Cell>
    </React.Fragment>
  );
};

const TilaBadge = ({ status = '', className }) => {
  const { t } = useTranslation();
  return (
    <div className={className}>{t(`yleiset.ePerusteStatus.${status}`)}</div>
  );
};

const StyledTilaBadge = styled(TilaBadge)`
  display: inline-block;
  padding: 1px 10px;
  font-weight: bold;
  ${getStatusCss}
`;

const InfoGrid = ({ rows, ...props }) => (
  <Grid
    columns={'auto minmax(0, 1fr)'}
    columnGap="20px"
    rowGap="25px"
    {...props}
  >
    {rows.map(({ title, description, suffix }) => (
      <InfoRow
        key={title}
        title={title}
        description={description}
        suffix={suffix}
      />
    ))}
  </Grid>
);

const KoulutusInfo = ({ koulutus, language = 'fi', peruste, className }) => {
  const { t } = useTranslation();

  const {
    nimi,
    koulutusala,
    opintojenlaajuus,
    nimikkeet,
    osaamisalat,
  } = useMemo(
    () => ({
      nimi: koulutus ? getLanguageValue(koulutus.nimi, language) : undefined,
      koulutusala: koulutus
        ? getLanguageValue(koulutus.koulutusala, language)
        : undefined,
      opintojenlaajuus: get(peruste, 'laajuus'),
      nimikkeet: peruste ? getTutkintonimikkeet({ peruste, language }) : [],
      osaamisalat: peruste ? getOsaamisalat({ peruste, language }) : [],
    }),
    [koulutus, peruste, language],
  );
  const apiUrls = useContext(UrlContext);

  return koulutus ? (
    <div className={className}>
      <Typography variant="h6" mb={2}>
        {t('koulutuslomake.koulutuksenTiedot')}
      </Typography>
      <InfoGrid
        style={{ marginBottom: '40px' }}
        rows={[
          {
            title: t('yleiset.koulutus'),
            description: `${nimi} (${koulutus.koodiArvo})`,
          },
          {
            title: t('yleiset.koulutusala'),
            description: koulutusala,
          },
        ]}
      />
      {peruste && (
        <>
          <Typography variant="h6" mb={2}>
            {t('yleiset.ePerusteenTiedot')}
          </Typography>
          <Grid columns="minmax(300px, 40%) auto">
            <Cell key="eperusteen-tiedot-1">
              <InfoGrid
                rows={[
                  {
                    title: t('yleiset.diaarinumero'),
                    description: (
                      <Anchor
                        href={apiUrls.url(
                          'eperusteet.kooste',
                          language,
                          get(peruste, 'id'),
                        )}
                        target="_blank"
                      >
                        {get(peruste, 'diaarinumero')}
                      </Anchor>
                    ),
                  },
                  {
                    title: t('yleiset.voimaantulo'),
                    description: getReadableDateTime(
                      get(peruste, 'voimassaoloAlkaa'),
                    ),
                  },
                  {
                    title: t('yleiset.tila'),
                    description: (
                      <StyledTilaBadge status={getStatus(peruste)} />
                    ),
                  },
                  {
                    title: t('yleiset.laajuus'),
                    description: opintojenlaajuus,
                    suffix: t('yleiset.osaamispistetta'),
                  },
                  {
                    title: t('yleiset.tutkintonimike'),
                    description: nimikkeet.map(n => <div key={n}>{n}</div>),
                  },
                ]}
              />
            </Cell>
            <Cell key="eperusteen-tiedot-2">
              <InfoGrid
                rows={[
                  {
                    title: t('yleiset.osaamisalat'),
                    description: osaamisalat.map(o => <div key={o}>{o}</div>),
                  },
                ]}
              />
            </Cell>
          </Grid>
        </>
      )}
    </div>
  ) : null;
};

const StyledKoulutusInfo = styled(KoulutusInfo)`
  background-color: ${getThemeProp('colors.secondaryBackground')};
  padding: ${({ theme }) => theme.spacing.unit * 4}px;
  line-height: 23px;
`;

const KoulutuksenTiedotSection = ({
  disabled,
  koulutustyyppi,
  language,
  koulutuskoodi,
  name,
  selectLabel: selectLabelProp,
}) => {
  const { t } = useTranslation();
  const koulutusFieldValue = get(koulutuskoodi, 'value');

  const { data: koulutus } = useApiAsync({
    promiseFn: getKoulutusByKoodi,
    koodiUri: koulutusFieldValue,
    watch: koulutusFieldValue,
  });

  const perusteFieldValue = useFieldValue(`${name}.peruste`);
  const perusteet = get(koulutus, 'perusteet');

  const selectedPeruste = find(
    perusteet,
    peruste => peruste.id === get(perusteFieldValue, 'value'),
  );

  const { change } = useBoundFormActions();
  const { isDirty } = useBoundFormSelectors();

  useEffect(() => {
    if (isDirty()) {
      change(`${name}.peruste`, null);
    }
  }, [change, koulutusFieldValue, isDirty, name]);

  const selectLabel = selectLabelProp || t('koulutuslomake.valitseKoulutus');

  return (
    <Box display="flex" flexDirection="column">
      <Box flexDirection="row" display="flex" mb={3}>
        <Box width={0.5} mr={2} {...getTestIdProps('koulutustyyppiSelect')}>
          <KoulutusField
            disabled={disabled}
            name={`${name}.koulutus`}
            koulutustyyppi={koulutustyyppi}
            label={selectLabel}
            language={language}
          />
        </Box>
        <Box width={0.5} ml={2} {...getTestIdProps('ePerusteSelect')}>
          <PerusteField
            name={`${name}.peruste`}
            perusteet={perusteet}
            language={language}
          />
        </Box>
      </Box>
      <Box flexDirection="row" width={1} display="flex" mr={2}>
        <Box width={1}>
          {koulutuskoodi ? (
            <StyledKoulutusInfo
              disabled={disabled}
              peruste={selectedPeruste}
              koulutus={koulutus}
              language={language}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default KoulutuksenTiedotSection;
