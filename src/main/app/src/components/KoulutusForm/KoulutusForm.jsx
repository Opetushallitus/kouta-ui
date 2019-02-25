import React from 'react';
import { formValues } from 'redux-form';

import TypeSection from './TypeSection';
import BaseSelectionSection from './BaseSelectionSection';
import InformationSection from './InformationSection';
import DescriptionSection from './DescriptionSection';
import OrganizationSection from './OrganizationSection';
import FormCollapseGroup from '../FormCollapseGroup';
import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';
import { LANGUAGE_TABS } from '../../constants';
import ToteutuksetModal from './ToteutuksetModal';
import ToteutuksetSection from './ToteutuksetSection';
import { ModalController } from '../Modal';
import Button from '../Button';
import { isFunction } from '../../utils';
import LisatiedotSection from './LisatiedotSection';
import Flex from '../Flex';

const ActiveLanguages = formValues({
  languages: 'kieliversiot.languages',
})(({ languages, ...props }) => {
  const activeLanguages = languages || [];

  return props.children({
    languages: LANGUAGE_TABS.filter(({ value }) =>
      activeLanguages.includes(value),
    ),
  });
});

const ActiveKoulutusTyyppi = formValues({
  koulutusTyyppi: 'type.type',
})(({ koulutusTyyppi, children }) => children({ koulutusTyyppi }));

const ActiveKoulutus = formValues({
  koulutus: 'information.koulutus',
})(({ koulutus, children }) => children({ koulutus }));

const ToteutuksetPohjaFieldValue = formValues({
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
  liitos = false,
  myOrganisaatioOid,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <ActiveLanguages>
        {({ languages }) => (
          <ActiveKoulutus>
            {({ koulutus }) => (
              <ActiveKoulutusTyyppi>
                {({ koulutusTyyppi }) => (
                  <FormCollapseGroup enabled={steps} scrollTarget={scrollTarget}>
                    <FormCollapse header="Koulutustyyppi" section="type" clearable={!liitos}>
                      <TypeSection disabled={liitos} />
                    </FormCollapse>

                    {canCopy ? (
                      <FormCollapse
                        header="Pohjan valinta"
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

                    <FormCollapse header="Kieliversiot" section="kieliversiot" clearable={!liitos}>
                      <KieliversiotFormSection disabled={liitos} />
                    </FormCollapse>

                    <FormCollapse
                      header="Koulutuksen tiedot"
                      section="information"
                      clearable={!liitos}
                    >
                      <InformationSection
                        disabled={liitos}
                        languages={languages}
                        koulutusTyyppi={koulutusTyyppi}
                      />
                    </FormCollapse>

                    <FormCollapse
                      header="Valitun koulutuksen kuvaus"
                      section="description"
                      clearable={!liitos}
                    >
                      <DescriptionSection
                        disabled={liitos}
                        languages={languages}
                        koodiUri={koulutus ? koulutus.value : null}
                      />
                    </FormCollapse>

                    <FormCollapse
                      header="Koulutuksen lisätiedot"
                      section="lisatiedot"
                      clearable={!liitos}
                    >
                      <LisatiedotSection languages={languages} disabled={liitos} />
                    </FormCollapse>

                    <FormCollapse
                      header="Koulutuksen järjestävä organisaatio"
                      section="organization"
                    >
                      <OrganizationSection organisaatioOid={myOrganisaatioOid || organisaatioOid} />
                    </FormCollapse>

                    {isFunction(onAttachToteutus) ? (
                      <FormCollapse
                        header="Koulutukseen liitetyt toteutukset"
                        id="koulutukseen-liitetetyt-toteutukset"
                        clearable={false}
                        actions={
                          <ToteutuksetPohjaFieldValue>
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
                                      Liitä toteutus
                                    </Button>
                                  </Flex>
                                )}
                              </ModalController>
                            )}
                          </ToteutuksetPohjaFieldValue>
                        }
                      >
                        <ToteutuksetSection koulutus={koulutusProp} />
                      </FormCollapse>
                    ) : null}
                  </FormCollapseGroup>
                )}
              </ActiveKoulutusTyyppi>
            )}
          </ActiveKoulutus>
        )}
      </ActiveLanguages>
    </form>
  );
};

export default KoulutusForm;
