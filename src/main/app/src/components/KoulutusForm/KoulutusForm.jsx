import React from 'react';
import { formValues } from 'redux-form';
import get from 'lodash/get';

import TypeSection from './TypeSection';
import BaseSelectionSection from './BaseSelectionSection';
import TiedotSection from './TiedotSection/TiedotSection';
import KuvausSection from './KuvausSection';
import OrganizationSection from './OrganizationSection';
import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';
import { KORKEAKOULUKOULUTUSTYYPIT } from '../../constants';
import ToteutuksetModal from './ToteutuksetModal';
import ToteutuksetSection from './ToteutuksetSection';
import { ModalController } from '../Modal';
import Button from '../Button';
import { isFunction } from '../../utils';
import LisatiedotSection from './LisatiedotSection';
import Flex from '../Flex';
import NakyvyysSection from './NakyvyysSection';
import useTranslation from '../useTranslation';

const WithValues = formValues({
  koulutustyyppiValue: 'type.type',
  languagesValue: 'kieliversiot.languages',
  koulutusValue: 'information.koulutus',
})(({ children, ...rest }) => children(rest));

const WithToteutuksetPohja = formValues({
  pohja: 'toteutukset.pohja',
})(({ pohja, children }) => children({ pohja }));

const toteutuksetModal = props => <ToteutuksetModal {...props} />;

const KoulutusForm = ({
  handleSubmit,
  organisaatioOid,
  onCopy = () => {},
  onMaybeCopy = () => {},
  steps = false,
  onCreateNew,
  onAttachToteutus,
  canCopy = true,
  scrollTarget,
  koulutus: koulutusProp = null,
  canEditKoulutustyyppi = true,
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit}>
      <WithValues>
        {({ languagesValue, koulutusValue, koulutustyyppiValue }) => {
          const koulutustyyppi =
            get(koulutusProp, 'koulutustyyppi') || koulutustyyppiValue;

          const languageTabs = languagesValue || [];

          return (
            <FormCollapseGroup enabled={steps} scrollTarget={scrollTarget}>
              {canEditKoulutustyyppi ? (
                <FormCollapse header={t('yleiset.koulutustyyppi')} section="type">
                  <TypeSection />
                </FormCollapse>
              ) : null}

              {canCopy ? (
                <FormCollapse
                  header={t('yleiset.pohjanValinta')}
                  section="base"
                  onContinue={onMaybeCopy}
                >
                  {({ onContinue }) => (
                    <BaseSelectionSection
                      onContinue={onContinue}
                      organisaatioOid={organisaatioOid}
                      onCopy={onCopy}
                      onCreateNew={onCreateNew}
                    />
                  )}
                </FormCollapse>
              ) : null}

              <FormCollapse header={t('yleiset.kieliversiot')} section="kieliversiot">
                <KieliversiotFormSection />
              </FormCollapse>

              <FormCollapse header={t('koulutuslomake.koulutuksenTiedot')} section="information">
                <TiedotSection
                  languages={languageTabs}
                  koulutustyyppi={koulutustyyppi}
                  koulutusValue={koulutusValue}
                />
              </FormCollapse>

              <FormCollapse
                header={t('koulutuslomake.koulutuksenKuvaus')}
                section="description"
              >
                <KuvausSection
                  languages={languageTabs}
                  koulutustyyppi={koulutustyyppi}
                  koulutusValue={koulutusValue}
                />
              </FormCollapse>

              <FormCollapse
                header={t('koulutuslomake.koulutuksenLisatiedot')}
                section="lisatiedot"
              >
                <LisatiedotSection languages={languageTabs} />
              </FormCollapse>

              <FormCollapse
                header={t('koulutuslomake.koulutuksenJarjestaja')}
                section="organization"
              >
                <OrganizationSection organisaatioOid={organisaatioOid} />
              </FormCollapse>

              {KORKEAKOULUKOULUTUSTYYPIT.includes(koulutustyyppi) ? (
                <FormCollapse
                  header="Koulutuksen näkyminen muille koulutustoimijoille"
                  section="nakyvyys"
                >
                  <NakyvyysSection />
                </FormCollapse>
              ) : null}

              {isFunction(onAttachToteutus) ? (
                <FormCollapse
                  header={t('koulutuslomake.koulutukseenLiitetytToteutukset')}
                  id="koulutukseen-liitetetyt-toteutukset"
                  clearable={false}
                  actions={
                    <WithToteutuksetPohja>
                      {({ pohja }) => (
                        <ModalController
                          modal={toteutuksetModal}
                          pohjaValue={pohja}
                          fieldName="toteutukset"
                          organisaatioOid={organisaatioOid}
                          onSave={onAttachToteutus}
                        >
                          {({ onToggle }) => (
                            <Flex justifyEnd full>
                              <Button onClick={onToggle} type="button">
                                {t('koulutuslomake.liitaToteutus')}
                              </Button>
                            </Flex>
                          )}
                        </ModalController>
                      )}
                    </WithToteutuksetPohja>
                  }
                >
                  <ToteutuksetSection koulutus={koulutusProp} />
                </FormCollapse>
              ) : null}
            </FormCollapseGroup>
          );
        }}
      </WithValues>
    </form>
  );
};

export default KoulutusForm;
