import {OrganisaatioStore} from './koulutus/OrganisaatioStore';
import {KoulutusDetailsStore} from './koulutus/KoulutusDetailsStore';
import {KoulutuskoodiListStore} from './koulutus/KoulutuskoodiListStore';
import {SectionStateStore} from './generic/SectionStateStore';
import {KoulutusPersistencyStore} from './koulutus/KoulutusPersistencyStore';
import {UrlStore} from './generic/UrlStore';
import {WorkflowStore} from './generic/WorkflowStore';
import {KoulutustyyppiCategoryStore} from './koulutus/KoulutustyyppiCategoryStore';
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
import {HakukohteenNimiStore} from './hakukohde/HakukohteenNimiStore';
import {ValintaperusteenNimiStore} from './valintaperusteet/ValintaperusteenNimiStore';
import {HaunPohjaStore} from './haku/HaunPohjaStore';
import {HakukohteenPohjaStore} from './hakukohde/HakukohteenPohjaStore';
import {ValintaperusteenPohjaStore} from './valintaperusteet/ValintaperusteenPohjaStore';
import {ToteutuksenYhteystiedotStore} from './toteutus/ToteutuksenYhteystiedotStore';
import {ToteutuksenOsaamisalaStore} from './toteutus/ToteutuksenOsaamisalaStore';
import {KoulutuksenKuvausStore} from './koulutus/KoulutuksenKuvausStore';

const initGenericStores = () => {
  UrlStore();
  SectionStateStore();
  WorkflowStore();
};

const initKoulutusStores = () => {
  OrganisaatioStore();
  KoulutustyyppiCategoryStore();
  KoulutuskoodiListStore();
  KoulutusDetailsStore();
  KoulutusPersistencyStore();
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
}

const initHakuStores = () => {
  HaunPohjaStore();
  HaunKieliversioStore();
  HaunNimiStore();
}

const initHakukohdeStores = () => {
  HakukohteenPohjaStore();
  HakukohteenKieliversioStore();
  HakukohteenNimiStore();
}

const initValintaperusteStores = () => {
  ValintaperusteenPohjaStore();
  ValintaperusteenKieliversioStore();
  ValintaperusteenNimiStore();
}

export const initStores = () => {
  initGenericStores();
  initKoulutusStores();
  initToteutusStores();
  initHakuStores();
  initHakukohdeStores();
  initValintaperusteStores();
}
