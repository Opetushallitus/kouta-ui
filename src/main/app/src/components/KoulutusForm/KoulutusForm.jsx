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
  onSaveAndAttachToteutus,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <ActiveLanguages>
        {({ languages }) => (
          <ActiveKoulutus>
            {({ koulutus }) => (
              <ActiveKoulutusTyyppi>
                {({ koulutusTyyppi }) => (
                  <FormCollapseGroup enabled={steps}>
                    <FormCollapse header="1 Koulutustyyppi" section="type">
                      <TypeSection />
                    </FormCollapse>

                    <FormCollapse
                      header="2 Pohjan valinta"
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

                    <FormCollapse
                      header="3 Kieliversiot"
                      section="kieliversiot"
                    >
                      <KieliversiotFormSection />
                    </FormCollapse>

                    <FormCollapse
                      header="4 Koulutuksen tiedot"
                      section="information"
                    >
                      <InformationSection
                        languages={languages}
                        koulutusTyyppi={koulutusTyyppi}
                      />
                    </FormCollapse>

                    <FormCollapse
                      header="5 Valitun koulutuksen kuvaus"
                      section="description"
                    >
                      <DescriptionSection
                        languages={languages}
                        koodiUri={koulutus ? koulutus.value : null}
                      />
                    </FormCollapse>

                    <FormCollapse
                      header="6 Koulutuksen lisätiedot"
                      section="lisatiedot"
                    >
                      <LisatiedotSection languages={languages} />
                    </FormCollapse>

                    <FormCollapse
                      header="6 Koulutuksen järjestävä organisaatio"
                      section="organization"
                    >
                      <OrganizationSection organisaatioOid={organisaatioOid} />
                    </FormCollapse>

                    {isFunction(onSaveAndAttachToteutus) ? (
                      <FormCollapse
                        header="7 Koulutukseen liitetyt toteutukset"
                        section="toteutukset"
                        actions={
                          <ToteutuksetPohjaFieldValue>
                            {({ pohja }) => (
                              <ModalController
                                modal={toteutuksetModal}
                                pohjaValue={pohja}
                                fieldName="toteutukset"
                                organisaatioOid={organisaatioOid}
                                onSave={onSaveAndAttachToteutus}
                              >
                                {({ onToggle }) => (
                                  <Button onClick={onToggle} type="button">
                                    Liitä toteutus
                                  </Button>
                                )}
                              </ModalController>
                            )}
                          </ToteutuksetPohjaFieldValue>
                        }
                      >
                        <ToteutuksetSection />
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
