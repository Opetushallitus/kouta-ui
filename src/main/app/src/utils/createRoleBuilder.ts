import _ from 'lodash';

import { OPH_PAAKAYTTAJA_ROLE } from '#/src/constants';
import getOrganisaatioParentOidPath from '#/src/utils/organisaatio/getOrganisaatioParentOidPath';

import getRoleOrganisaatioOid from './getRoleOrganisaatioOid';
import isOid from './isOid';

const READ_ROLES = ['READ', 'READ_UPDATE', 'CRUD'];
const UPDATE_ROLES = ['UPDATE', 'READ_UPDATE', 'CRUD'];
const CREATE_ROLES = ['CRUD'];

const getRoleName = role => {
  if (!_.isString(role)) {
    return undefined;
  }

  const parts = role.split('_');

  return parts.filter(v => !isOid(v)).join('_');
};

const resolveOidPath = value => {
  if (_.isString(value)) {
    return [value];
  }

  if (_.isArray(value)) {
    return value;
  }

  if (_.isObject(value)) {
    return getOrganisaatioParentOidPath(value);
  }

  return [];
};

const createRoleLookup = roles => {
  const lookup = {};

  // eslint-disable-next-line
  for (const role of roles) {
    const organisaatioOid = getRoleOrganisaatioOid(role);

    if (!organisaatioOid) {
      continue;
    }

    const roleName = getRoleName(role);

    if (!roleName) {
      continue;
    }

    _.set(lookup, [organisaatioOid, roleName], true);
  }

  return lookup;
};

class RoleBuilder {
  constructor({ roles = [], roleLookup, result = true } = {}) {
    this.currentResult = result;
    this.roleLookup = roleLookup ? roleLookup : createRoleLookup(roles);
  }

  hasOneOfFn(getCheckFn, roles, organisaatio) {
    return roles.reduce((acc, curr) => {
      return acc.or(rb => getCheckFn(rb)(curr, organisaatio));
    }, this.clone(false));
  }

  hasAllFn(getCheckFn, roles, organisaatio) {
    return roles.reduce((acc, curr) => {
      return acc.and(rb => getCheckFn(rb)(curr, organisaatio));
    }, this.clone(true));
  }

  hasOrganisaatioRole(role, organisaatioOid) {
    return (
      this.roleLookup.hasOwnProperty(organisaatioOid) &&
      this.roleLookup[organisaatioOid].hasOwnProperty(role)
    );
  }

  hasRead(role, organisaatio) {
    return this.clone(
      Boolean(
        resolveOidPath(organisaatio).find(oid => {
          return (
            this.hasOrganisaatioRole(OPH_PAAKAYTTAJA_ROLE, oid) ||
            READ_ROLES.map(r =>
              this.hasOrganisaatioRole(`${role}_${r}`, oid)
            ).some(Boolean)
          );
        })
      )
    );
  }

  hasReadOneOf(roles, organisaatio) {
    return this.hasOneOfFn(
      rb => (...args) => rb.hasRead(...args),
      roles,
      organisaatio
    );
  }

  hasReadAll(roles, organisaatio) {
    return this.hasAllFn(
      rb => (...args) => rb.hasRead(...args),
      roles,
      organisaatio
    );
  }

  hasUpdate(role, organisaatio) {
    return this.clone(
      Boolean(
        resolveOidPath(organisaatio).find(oid => {
          return (
            this.hasOrganisaatioRole(OPH_PAAKAYTTAJA_ROLE, oid) ||
            UPDATE_ROLES.map(r =>
              this.hasOrganisaatioRole(`${role}_${r}`, oid)
            ).some(Boolean)
          );
        })
      )
    );
  }

  hasUpdateOneOf(roles, organisaatio) {
    return this.hasOneOfFn(
      rb => (...args) => rb.hasUpdate(...args),
      roles,
      organisaatio
    );
  }

  hasUpdateAll(roles, organisaatio) {
    return this.hasAllFn(
      rb => (...args) => rb.hasUpdate(...args),
      roles,
      organisaatio
    );
  }

  hasCreate(role, organisaatio) {
    return this.clone(
      Boolean(
        resolveOidPath(organisaatio).find(oid => {
          return (
            this.hasOrganisaatioRole(OPH_PAAKAYTTAJA_ROLE, oid) ||
            CREATE_ROLES.map(r =>
              this.hasOrganisaatioRole(`${role}_${r}`, oid)
            ).some(Boolean)
          );
        })
      )
    );
  }

  hasCreateOneOf(roles, organisaatio) {
    return this.hasOneOfFn(
      rb => (...args) => rb.hasCreate(...args),
      roles,
      organisaatio
    );
  }

  hasCreateAll(roles, organisaatio) {
    return this.hasAllFn(
      rb => (...args) => rb.hasCreate(...args),
      roles,
      organisaatio
    );
  }

  clone(result) {
    return new RoleBuilder({
      roleLookup: this.roleLookup,
      result,
    });
  }

  or(fn) {
    return this.clone(this.result() || fn(this.clone()).result());
  }

  and(fn) {
    return this.clone(this.result() && fn(this.clone()).result());
  }

  result() {
    return this.currentResult;
  }
}

const createRoleBuilder = args => new RoleBuilder(args);

export default createRoleBuilder;
