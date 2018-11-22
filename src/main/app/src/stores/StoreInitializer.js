import {KoulutuksenOrganisaatioStore} from './koulutus/KoulutuksenOrganisaatioStore';
import {KoulutuskoodiListStore} from './koulutus/KoulutuskoodiListStore';
import {SectionStateStore} from './generic/SectionStateStore';
import {UrlStore} from './generic/UrlStore';
import {WorkflowStore} from './generic/WorkflowStore';
import {KoulutusStore} from './koulutus/KoulutusStore';
import {KoulutuksenKieliversioStore} from './koulutus/KoulutuksenKieliversioStore';
import {KoulutuksenNimiStore} from './koulutus/KoulutuksenNimiStore';
import {KoulutuksenPohjaStore} from './koulutus/KoulutuksenPohjaStore';
import {ToteutuksenPohjaStore} from './toteutus/ToteutuksenPohjaStore';
import {ToteutuksenKieliversioStore} from './toteutus/ToteutuksenKieliversioStore';
import {HaunKieliversioStore} from './haku/HaunKieliversioStore';
import {HakukohteenKieliversioStore} from './hakukohde/HakukohteenKieliversioStore';
import {ValintaperusteenKieliversioStore} from './valintaperusteet/ValintaperusteenKieliversioStore';
import {ToteutuksenNimiStore} from './toteutus/ToteutuksenNimiStore';
import {HaunNimiStore} from './haku/HaunNimiStore';
import {HakukohteenPerustiedotStore} from './hakukohde/HakukohteenPerustiedotStore';
import {ValintaperusteenNimiStore} from './valintaperusteet/ValintaperusteenNimiStore';
import {HaunPohjaStore} from './haku/HaunPohjaStore';
import {HakukohteenPohjaStore} from './hakukohde/HakukohteenPohjaStore';
import {ValintaperusteenPohjaStore} from './valintaperusteet/ValintaperusteenPohjaStore';
import {ToteutuksenYhteystiedotStore} from './toteutus/ToteutuksenYhteystiedotStore';
import {ToteutuksenOsaamisalaStore} from './toteutus/ToteutuksenOsaamisalaStore';
import {KoulutuksenKuvausStore} from './koulutus/KoulutuksenKuvausStore';
import {HaunKohdejoukkoStore} from './haku/HaunKohdejoukkoStore';
import {KoulutusOptionsStore} from './koulutus/KoulutusOptionsStore';
import {KoulutuksenTiedotStore} from './koulutus/KoulutuksenTiedotStore';
import {HaunHakutapaStore} from './haku/HaunHakutapaStore';
import {HaunLiitetytHakukohteetStore} from './haku/HaunLiitetytHakukohteetStore';
import {HaunYhteystiedotStore} from './haku/HaunYhteystiedotStore';
import {ToteutuksenJarjestamistiedotStore} from './toteutus/ToteutuksenJarjestamistiedotStore';
import {HaunLomakkeetStore} from './haku/HaunLomakkeetStore';
import {HakukohteenPohjakoulutusvaatimusStore} from './hakukohde/HakukohteenPohjakoulutusvaatimusStore';
import {HakukohteenLomakeStore} from './hakukohde/HakukohteenLomakeStore';
import {HakukohteenHakuajatStore} from './hakukohde/HakukohteenHakuajatStore';
import {HakukohteenAlkamiskausiStore} from './hakukohde/HakukohteenAlkamiskausiStore';
import {HakukohteenAloituspaikatStore} from './hakukohde/HakukohteenAloituspaikatStore';
import {HakukohteenValintaperusteenKuvausStore} from './hakukohde/HakukohteenValintaperusteenKuvausStore';
import {HakukohteenValintakoeStore} from './hakukohde/HakukohteenValintakoeStore';
import {HakukohteenTarvittavatLiitteetStore} from './hakukohde/HakukohteenTarvittavatLiitteetStore';
import {ValintaperusteenSoraKuvausStore} from './valintaperusteet/ValintaperusteenSoraKuvausStore';
import {ValintaperusteenKielitaitovaatimuksetStore} from './valintaperusteet/ValintaperusteenKielitaitovaatimuksetStore';
import {ValintaperusteenVahimmaisehdotStore} from './valintaperusteet/ValintaperusteenVahimmaisehdotStore';
import {ValintaperusteenOsaamistaustaStore} from './valintaperusteet/ValintaperusteenOsaamistaustaStore';
import {ValintaperusteenHaunKohdejoukkoStore} from './valintaperusteet/ValintaperusteenHaunKohdejoukkoStore';
import {ValintaperusteenValintatapaStore} from './valintaperusteet/ValintaperusteenValintatapaStore';
import {ValintaperusteenHakutapaStore} from './valintaperusteet/ValintaperusteenHakutapaStore';

const initGenericStores = () => {
  UrlStore();
  SectionStateStore();
  WorkflowStore();
};

const initKoulutusStores = () => {
  KoulutuksenOrganisaatioStore();
  KoulutusOptionsStore();
  KoulutusStore();
  KoulutuksenTiedotStore();
  KoulutuskoodiListStore();
  KoulutuksenTiedotStore();
  KoulutuksenKieliversioStore();
  KoulutuksenNimiStore();
  KoulutuksenPohjaStore();
  KoulutuksenKuvausStore();
}

const initToteutusStores = () => {
  ToteutuksenPohjaStore();
  ToteutuksenKieliversioStore();
  ToteutuksenOsaamisalaStore();
  ToteutuksenNimiStore();
  ToteutuksenYhteystiedotStore();
  ToteutuksenJarjestamistiedotStore();
}

const initHakuStores = () => {
  HaunPohjaStore();
  HaunKieliversioStore();
  HaunNimiStore();
  HaunKohdejoukkoStore();
  HaunHakutapaStore();
  HaunLiitetytHakukohteetStore();
  HaunYhteystiedotStore();
  HaunLomakkeetStore();
}

const initHakukohdeStores = () => {
  HakukohteenPohjaStore();
  HakukohteenKieliversioStore();
  HakukohteenPerustiedotStore();
  HakukohteenPohjakoulutusvaatimusStore();
  HakukohteenHakuajatStore();
  HakukohteenLomakeStore();
  HakukohteenAlkamiskausiStore();
  HakukohteenAloituspaikatStore();
  HakukohteenValintaperusteenKuvausStore();
  HakukohteenValintakoeStore();
  HakukohteenTarvittavatLiitteetStore();
}

const initValintaperusteStores = () => {
  ValintaperusteenPohjaStore();
  ValintaperusteenKieliversioStore();
  ValintaperusteenNimiStore();
  ValintaperusteenHakutapaStore();
  ValintaperusteenHaunKohdejoukkoStore();
  ValintaperusteenOsaamistaustaStore();
  ValintaperusteenVahimmaisehdotStore();
  ValintaperusteenValintatapaStore();
  ValintaperusteenKielitaitovaatimuksetStore();
  ValintaperusteenSoraKuvausStore();

}

export const initStores = () => {
  initGenericStores();
  initKoulutusStores();
  initToteutusStores();
  initHakuStores();
  initHakukohdeStores();
  initValintaperusteStores();
}
