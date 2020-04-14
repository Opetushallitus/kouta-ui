import produce from 'immer';
import _ from 'lodash';

class FormConfigBuilder {
  constructor(config = {}, koulutustyyppiLookup = {}) {
    this.config = config;
    this.koulutustyyppiLookup = koulutustyyppiLookup;
  }

  registerField(
    section,
    field,
    koulutustyypit,
    validate,
    meta = {},
    formFieldName,
    required,
  ) {
    koulutustyypit.forEach(t => {
      console.assert(
        _.get(this.koulutustyyppiLookup, [
          t,
          `sections.${section}.fields.${field}`,
        ]) == null,
        `Overwriting form configuration (koulutustyyppi: "${t}") for field "${section}.${field}"`,
      );

      _.set(
        this.koulutustyyppiLookup,
        [t, `sections.${section}.fields.${field}`],
        true,
      );
    });

    this.config = produce(this.config, draft => {
      _.set(draft, ['sections', section, 'fields', field], {
        koulutustyypit,
        validate,
        meta,
        formFieldName: formFieldName || field,
        required,
      });
    });
    return this;
  }

  registerFieldTree(fieldsTree) {
    fieldsTree.forEach(({ section, field, fields, ...rest }) =>
      [
        ...(fields || []),
        ...(field ? [{ name: field, ...rest }] : []),
      ].forEach(
        ({ name, koulutustyypit, formFieldName, validate, meta, required }) =>
          this.registerField(
            section,
            name,
            koulutustyypit,
            validate,
            meta,
            formFieldName,
            required,
          ),
      ),
    );
    return this;
  }

  getKoulutustyyppiConfig(koulutustyyppi) {
    const paths = Object.keys(this.koulutustyyppiLookup[koulutustyyppi] || {});

    return _.pick(this.config, paths);
  }

  getConfig() {
    return this.config;
  }
}

const createFormConfigBuilder = config => new FormConfigBuilder(config);

export default createFormConfigBuilder;
