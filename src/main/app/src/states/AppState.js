import {dispatch} from 'metamatic';

const AppState = {
  section: {
    koulututusTyyppi: {}
  }
};

export const STATE_KOULUTUS_SELECTOR_VISIBLE = 'STATE_KOULUTUS_SELECTOR_VISIBLE';

export const showKoulutusSelector = () => {
  AppState.koulutusSelectorVisible = true;
  dispatch(STATE_KOULUTUS_SELECTOR_VISIBLE, AppState.koulutusSelectorVisible);
}

export const STATE_SECTION_KOULUTUSTYYPPI_EXPANDED = 'STATE_SECTION_KOULUTUSTYYPPI_EXPANDED';

export const expandKoulutusTyyppiSection = () => {
  AppState.section.koulututusTyyppi.expanded = true;
  dispatch(STATE_SECTION_KOULUTUSTYYPPI_EXPANDED, AppState.section.koulututusTyyppi.expanded);
}