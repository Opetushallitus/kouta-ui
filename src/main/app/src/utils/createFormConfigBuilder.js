import _ from 'lodash';

class FormConfigBuilder {
  constructor(config = {}) {
    this.config = config;
  }

  registerItem(type = 'field', section, options) {
    const { koulutustyypit = ['default'], name, noOverwrite } = options;

    koulutustyypit.forEach(t => {
      const exists =
        _.get(this.config, [t, 'sections', section, `${type}s`, name]) == null;

      if (noOverwrite) {
        if (!exists) {
          _.set(
            this.config,
            [t, 'sections', section, `${type}s`, name],
            options,
          );
        }
      } else {
        console.assert(
          exists,
          `Overwriting form config (koulutustyyppi: "${t}") for ${type} "${section}.${name}"`,
        );
        _.set(this.config, [t, 'sections', section, `${type}s`, name], options);
      }
    });

    return this;
  }

  registerFragment({ section, name, field, koulutustyypit }) {
    if (!field) {
      // When registering a fragment without field, allow the section-field
      // so that fragment is shown even when the field is not added to config
      this.registerItem('field', section, {
        name: section,
        koulutustyypit,
        noOverwrite: true,
      });
    }
    return this.registerItem('fragment', section, { name, koulutustyypit });
  }

  registerField(section, field, koulutustyypit, validate, meta = {}, required) {
    // Prefix field name with section, if it starts with a dot.
    const name = _.first(field) === '.' ? `${section}${field}` : field;
    return this.registerItem('field', section, {
      name,
      koulutustyypit,
      validate,
      meta,
      required,
    });
  }

  registerSections(sectionTree) {
    sectionTree.forEach(
      ({
        section,
        field,
        fragment,
        koulutustyypit: parentKTs,
        parts = [],
        ...rest
      }) => {
        [...parts, ...[{ field, fragment, ...rest }]].forEach(
          ({
            field,
            fragment,
            koulutustyypit = parentKTs,
            validate,
            meta,
            required,
          }) => {
            fragment &&
              this.registerFragment({
                section,
                name: fragment,
                field,
                koulutustyypit,
              });
            field &&
              this.registerField(
                section,
                field,
                koulutustyypit,
                validate,
                meta,
                required,
              );
          },
        );
      },
    );
    return this;
  }

  getKoulutustyyppiConfig(koulutustyyppi = 'default') {
    return _.get(this.config, koulutustyyppi);
  }

  getConfig(koulutustyyppi = 'default') {
    return _.get(this.config, koulutustyyppi);
  }
}

const createFormConfigBuilder = config => new FormConfigBuilder(config);

export default createFormConfigBuilder;
