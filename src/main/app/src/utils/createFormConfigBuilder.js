import produce from 'immer';
import { pick, set } from 'lodash';

class FormConfigBuilder {
  constructor(config = {}, koulutustyypiLookup = {}) {
    this.config = config;
    this.koulutustyypiLookup = koulutustyypiLookup;
  }

  registerField(section, field, koulutustyypit, validate, meta = {}) {
    koulutustyypit.forEach(t => {
      this.koulutustyypiLookup[t] = this.koulutustyypiLookup[t] || {};
      this.koulutustyypiLookup[t][`sections.${section}.fields.${field}`] = true;
    });

    return new FormConfigBuilder(
      produce(this.config, draft => {
        set(draft, ['sections', section, 'fields', field], {
          koulutustyypit,
          validate,
          meta,
        });
      }),
      this.koulutustyypiLookup,
    );
  }

  getKoulutustyyppiConfig(koulutustyyppi) {
    const paths = Object.keys(this.koulutustyypiLookup[koulutustyyppi] || {});

    return pick(this.config, paths);
  }

  getConfig() {
    return this.config;
  }
}

const createFormConfigBuilder = config => new FormConfigBuilder(config);

export default createFormConfigBuilder;
