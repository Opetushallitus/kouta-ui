import React from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import Button from '#/src/components/Button';
import { FormFieldCheckbox } from '#/src/components/formFields';
import { Tooltip } from '#/src/components/Tooltip';
import { JULKAISUTILA } from '#/src/constants';
import FormConfigSectionContext from '#/src/contexts/FormConfigSectionContext';
import { useFieldValue, useIsDirty } from '#/src/hooks/form';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';

const Link = ({ children, ...props }) => <a {...props}>{children}</a>;

const Separator = styled.div`
  padding-left: 15px;
`;

type EsikatseluProps = {
  esikatseluUrl?: string;
};

export const EsikatseluControls: React.FC<EsikatseluProps> = ({
  esikatseluUrl,
}) => {
  const { t } = useTranslation();

  const isOphVirkailija = useIsOphVirkailija();
  const esikatseluEnabled = useFieldValue('esikatselu');
  const tila = useFieldValue('tila');

  const isDirty = useIsDirty();

  const disabled =
    isDirty || _.isNil(esikatseluUrl) || tila !== JULKAISUTILA.TALLENNETTU;

  return (
    <FormConfigSectionContext.Provider value="esikatselu">
      {esikatseluEnabled && (
        <Separator>
          <Tooltip
            placement="top"
            trigger={disabled ? 'hover' : []}
            overlay={
              <span>{t('yleiset.tallennaLuonnoksenaEsikatsellaksesi')}</span>
            }
            arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
            overlayStyle={{
              position: 'fixed',
            }}
          >
            <Button
              as={Link}
              href={esikatseluUrl}
              color="primary"
              variant="outlined"
              target="_blank"
              disabled={disabled}
            >
              {t('yleiset.esikatselu')}
            </Button>
          </Tooltip>
        </Separator>
      )}
      {isOphVirkailija && (
        <Separator>
          <Field name="esikatselu" component={FormFieldCheckbox}>
            {t('yleiset.salliEsikatselu')}
          </Field>
        </Separator>
      )}
    </FormConfigSectionContext.Provider>
  );
};

export default EsikatseluControls;
