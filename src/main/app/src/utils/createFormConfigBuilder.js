import _ from 'lodash';

const KOULUTUSTYYPPI_DEFAULT = 'default';

class FormConfigBuilder {
  constructor(config = {}) {
    this.config = config;
  }

  registerPart(type = 'field', section, options) {
    const {
      koulutustyypit: koulutustyypitOption = [],
      name,
      noOverwrite,
    } = options;

    // 'default' koulutustyyppi always configured. This way forms that don't care about
    // 'koulutustyyppi' will work just fine, even if koulutustyyppi given.
    const koulutustyypit = [KOULUTUSTYYPPI_DEFAULT, ...koulutustyypitOption];
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
        _.set(this.config, [t, 'sections', section, `${type}s`, name], options);
      }
    });

    return this;
  }

  registerFragment({ section, name, field, koulutustyypit }) {
    if (!field) {
      // When registering a fragment without field, allow the section-field
      // so that fragment is shown even when the field is not added to config
      this.registerPart('field', section, {
        name: section,
        koulutustyypit,
        noOverwrite: true,
      });
    }
    return this.registerPart('fragment', section, { name, koulutustyypit });
  }

  registerField(section, field, koulutustyypit, validate, meta = {}, required) {
    // Prefix field name with section, if it starts with a dot.
    const name = _.first(field) === '.' ? `${section}${field}` : field;
    return this.registerPart('field', section, {
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

  getKoulutustyyppiConfig(koulutustyyppi = KOULUTUSTYYPPI_DEFAULT) {
    return _.get(this.config, koulutustyyppi);
  }

  getConfig(koulutustyyppi = KOULUTUSTYYPPI_DEFAULT) {
    return _.get(this.config, koulutustyyppi);
  }
}

const createFormConfigBuilder = config => new FormConfigBuilder(config);

export default createFormConfigBuilder;
