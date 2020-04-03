import produce from 'immer';
import { pick, set } from 'lodash';

class FormConfigBuilder {
  constructor(config = {}, koulutustyyppiLookup = {}) {
    this.config = config;
    this.koulutustyyppiLookup = koulutustyyppiLookup;
  }

  registerField(section, field, koulutustyypit, validate, meta = {}) {
    koulutustyypit.forEach(t => {
      this.koulutustyyppiLookup[t] = this.koulutustyyppiLookup[t] || {};
      this.koulutustyyppiLookup[t][
        `sections.${section}.fields.${field}`
      ] = true;
    });

    this.config = produce(this.config, draft => {
      set(draft, ['sections', section, 'fields', field], {
        koulutustyypit,
        validate,
        meta,
      });
    });
    return this;
  }

  registerFieldTree(fieldsTree) {
    fieldsTree.forEach(
      ({ section, field, fields, koulutustyypit, validate, meta }) =>
        [
          ...(fields || []),
          ...(field ? [{ name: field, koulutustyypit, validate, meta }] : []),
        ].forEach(({ name, koulutustyypit, validate, meta }) =>
          this.registerField(section, name, koulutustyypit, validate, meta),
        ),
    );
    return this;
  }

  getKoulutustyyppiConfig(koulutustyyppi) {
    const paths = Object.keys(this.koulutustyyppiLookup[koulutustyyppi] || {});

    return pick(this.config, paths);
  }

  getConfig() {
    return this.config;
  }
}

const createFormConfigBuilder = config => new FormConfigBuilder(config);

export default createFormConfigBuilder;
