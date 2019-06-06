import set from 'lodash/set';

import getOrganisaatioParentOidPath from './getOrganisaatioParentOidPath';
import getRoleOrganisaatioOid from './getRoleOrganisaatioOid';
import isOid from './isOid';
import { isString, isObject, isArray } from './index';

const getRoleName = role => {
  if (!isString(role)) {
    return undefined;
  }

  const parts = role.split('_');

  return parts.filter(v => !isOid(v)).join('_');
};

const resolveOidPath = value => {
  if (isString(value)) {
    return [value];
  }

  if (isArray(value)) {
    return value;
  }

  if (isObject(value)) {
    return getOrganisaatioParentOidPath(value);
  }

  return [];
};

const createRoleLookup = roles => {
  const lookup = {};

  for (let role of roles) {
    const organisaatioOid = getRoleOrganisaatioOid(role);

    if (!organisaatioOid) {
      continue;
    }

    const roleName = getRoleName(role);

    if (!roleName) {
      continue;
    }

    set(lookup, [organisaatioOid, roleName], true);
  }

  return lookup;
};

class RoleBuilder {
  constructor({ roles = [], roleLookup, result = true } = {}) {
    this.currentResult = result;
    this.roleLookup = roleLookup ? roleLookup : createRoleLookup(roles);
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
            this.hasOrganisaatioRole(`${role}_READ`, oid) ||
            this.hasOrganisaatioRole(`${role}_CRUD`, oid)
          );
        }),
      ),
    );
  }

  hasReadOneOf(roles, organisaatio) {
    return roles.reduce((acc, curr) => {
      return acc.or(rb => rb.hasRead(curr, organisaatio));
    }, this.clone(false));
  }

  hasReadAll(roles, organisaatio) {
    return roles.reduce((acc, curr) => {
      return acc.and(rb => rb.hasRead(curr, organisaatio));
    }, this.clone(true));
  }

  hasWrite(role, organisaatio) {
    return this.clone(
      Boolean(
        resolveOidPath(organisaatio).find(oid => {
          return (
            this.hasOrganisaatioRole(`${role}_WRITE`, oid) ||
            this.hasOrganisaatioRole(`${role}_CRUD`, oid)
          );
        }),
      ),
    );
  }

  hasWriteOneOf(roles, organisaatio) {
    return roles.reduce((acc, curr) => {
      return acc.or(rb => rb.hasWrite(curr, organisaatio));
    }, this.clone(false));
  }

  hasWriteAll(roles, organisaatio) {
    return roles.reduce((acc, curr) => {
      return acc.and(rb => rb.hasWrite(curr, organisaatio));
    }, this.clone(true));
  }

  hasCrud(role, organisaatio) {
    return this.clone(
      Boolean(
        resolveOidPath(organisaatio).find(oid => {
          return this.hasOrganisaatioRole(`${role}_CRUD`, oid);
        }),
      ),
    );
  }

  hasCrudOneOf(roles, organisaatio) {
    return roles.reduce((acc, curr) => {
      return acc.or(rb => rb.hasCrud(curr, organisaatio));
    }, this.clone(false));
  }

  hasCrudAll(roles, organisaatio) {
    return roles.reduce((acc, curr) => {
      return acc.and(rb => rb.hasCrud(curr, organisaatio));
    }, this.clone(true));
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
