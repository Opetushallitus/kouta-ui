import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import Button from '#/src/components/Button';
import { FormFieldCheckbox } from '#/src/components/formFields';
import { Tooltip } from '#/src/components/Tooltip';
import { JULKAISUTILA } from '#/src/constants';
import { useFieldValue, useIsDirty } from '#/src/hooks/form';

const Separator = styled.div`
  padding-left: 15px;
`;

type EsikatseluProps = {
  esikatseluUrl?: string;
};

const withDraft = (s: string) => s + '?draft=true';

export const EsikatseluControls: React.FC<EsikatseluProps> = ({
  esikatseluUrl,
}) => {
  const { t } = useTranslation();

  const tila = useFieldValue('tila');
  const entityExistsAfterThisEdit =
    tila !== JULKAISUTILA.POISTETTU && tila !== JULKAISUTILA.ARKISTOITU;
  const isJulkaistu = tila === JULKAISUTILA.JULKAISTU;
  const showCheckbox = _.isNil(tila) || tila === JULKAISUTILA.TALLENNETTU;
  const esikatseluEnabled = useFieldValue('esikatselu');
  const showButton =
    entityExistsAfterThisEdit && (esikatseluEnabled || isJulkaistu);
  const isDirty = useIsDirty();

  const disabled =
    !esikatseluUrl || // NOTE: url can be false or undefined
    (tila === JULKAISUTILA.TALLENNETTU && isDirty);
  const tooltipKey = isJulkaistu
    ? 'yleiset.naytaJulkaistuTooltip'
    : 'yleiset.tallennaLuonnoksenaEsikatsellaksesi';
  const textKey = isJulkaistu ? 'yleiset.naytaJulkaistu' : 'yleiset.esikatselu';

  return (
    <>
      {showButton && (
        <Separator>
          <Tooltip
            placement="top"
            trigger={isJulkaistu || disabled ? ['hover'] : []}
            overlay={<span>{t(tooltipKey)}</span>}
            overlayStyle={{
              position: 'fixed',
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              target="_blank"
              disabled={disabled}
              {...(disabled // NOTE: disabled won't prevent the link from functioning
                ? {}
                : {
                    as: 'a',
                    href: isJulkaistu
                      ? esikatseluUrl
                      : withDraft(esikatseluUrl!),
                  })}
            >
              {t(textKey)}
            </Button>
          </Tooltip>
        </Separator>
      )}
      {showCheckbox && (
        <Separator>
          <Field name="esikatselu" component={FormFieldCheckbox}>
            {t('yleiset.salliEsikatselu')}
          </Field>
        </Separator>
      )}
    </>
  );
};
