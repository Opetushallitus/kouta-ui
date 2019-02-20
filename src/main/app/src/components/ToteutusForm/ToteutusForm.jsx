import React from 'react';
import { formValues } from 'redux-form';

import FormCollapse from '../FormCollapse';
import KieliversiotFormSection from '../KieliversiotFormSection';
import { LANGUAGE_TABS } from '../../constants';
import OsaamisalatSection from './OsaamisalatSection';
import YhteystiedotSection from './YhteystiedotSection';
import NimiSection from './NimiSection';
import PohjaSection from './PohjaSection';
import JarjestamisPaikatSection from './JarjestamisPaikatSection';
import JarjestamisTiedotSection from './JarjestamisTiedotSection';
import NayttamisTiedotSection from './NayttamisTiedotSection';
import FormCollapseGroup from '../FormCollapseGroup';
import HakukohteetSection from './HakukohteetSection';
import { isFunction } from '../../utils';
import HakukohteetModal from './HakukohteetModal';
import { ModalController } from '../Modal';
import Flex from '../Flex';
import Button from '../Button';

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

const HakukohteetPohjaAndHakuFieldValue = formValues({
  pohja: 'hakukohteet.pohja',
  haku: 'hakukohteet.haku'
})(({ pohja, haku, children }) => children({ pohja, haku }));

const hakukohteetModal = props => <HakukohteetModal {...props} />;

const ToteutusForm = ({
  handleSubmit,
  koulutusKoodiUri,
  organisaatioOid,
  onMaybeCopy = () => {},
  onCreateNew = () => {},
  steps = false,
  canCopy = true,
  scrollTarget,
  toteutus,
  onAttachHakukohde,
}) => (
  <form onSubmit={handleSubmit}>
    <ActiveLanguages>
      {({ languages }) => (
        <FormCollapseGroup enabled={steps} scrollTarget={scrollTarget}>
          {canCopy ? (
            <FormCollapse
              header="Pohjan valinta"
              section="base"
              onContinue={onMaybeCopy}
            >
              {({ onContinue }) => (
                <PohjaSection
                  organisaatioOid={organisaatioOid}
                  onCreateNew={onCreateNew}
                  onContinue={onContinue}
                />
              )}
            </FormCollapse>
          ) : null}

          <FormCollapse header="Kieliversiot" section="kieliversiot">
            <KieliversiotFormSection />
          </FormCollapse>

          <FormCollapse header="Valitse osaamisalat" section="osaamisalat">
            <OsaamisalatSection
              languages={languages}
              koulutusKoodiUri={koulutusKoodiUri}
            />
          </FormCollapse>

          <FormCollapse
            header="Toteutuksen järjestämistiedot"
            section="jarjestamistiedot"
          >
            <JarjestamisTiedotSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="Koulutuksen näyttämiseen liittyvät tiedot"
            section="nayttamistiedot"
          >
            <NayttamisTiedotSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="Missä järjestetään?"
            section="jarjestamispaikat"
          >
            <JarjestamisPaikatSection organisaatioOid={organisaatioOid} />
          </FormCollapse>

          <FormCollapse header="Toteutuksen nimi" section="nimi">
            <NimiSection languages={languages} />
          </FormCollapse>

          <FormCollapse
            header="Koulutuksen yhteystiedot"
            section="yhteystiedot"
          >
            <YhteystiedotSection languages={languages} />
          </FormCollapse>

          {isFunction(onAttachHakukohde) ? (
            <FormCollapse
              header="Toteutukseen liitetyt hakukohteet"
              id="toteutukseen-liitetetyt-hakukohteet"
              clearable={false}
              actions={
                <HakukohteetPohjaAndHakuFieldValue>
                  {({ pohja, haku }) => (
                    <ModalController
                      modal={hakukohteetModal}
                      pohjaValue={pohja}
                      hakuValue={haku}
                      fieldName="hakukohteet"
                      organisaatioOid={organisaatioOid}
                      onSave={onAttachHakukohde}
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
                </HakukohteetPohjaAndHakuFieldValue>
              }
            >
              <HakukohteetSection toteutus={toteutus} />
            </FormCollapse>
          ) : null}
        </FormCollapseGroup>
      )}
    </ActiveLanguages>
  </form>
);

export default ToteutusForm;
