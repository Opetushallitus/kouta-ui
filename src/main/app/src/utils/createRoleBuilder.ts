import _ from 'lodash';

import { OPH_PAAKAYTTAJA_ROLE } from '#/src/constants';
import { OrganisaatioModel } from '#/src/types/domainTypes';

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

const getParentAndSelfOids = (
  organisaatioOrOids: OrganisaatioModel | Array<string> | string
) => {
  if (_.isString(organisaatioOrOids)) {
    return [organisaatioOrOids];
  }

  if (_.isArray(organisaatioOrOids)) {
    return organisaatioOrOids;
  }

  const parentOids = organisaatioOrOids?.parentOids;
  const organisaatioOid = organisaatioOrOids?.oid;
  const parentsAndSelf = _.isEmpty(parentOids)
    ? [organisaatioOid]
    : [...parentOids, organisaatioOid];

  return parentsAndSelf.filter(Boolean);
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
    return Boolean(this.roleLookup?.[organisaatioOid]?.[role]);
  }

  hasRead(role, organisaatio) {
    return this.clone(
      getParentAndSelfOids(organisaatio).some(oid => {
        return (
          this.hasOrganisaatioRole(OPH_PAAKAYTTAJA_ROLE, oid) ||
          READ_ROLES.some(r => this.hasOrganisaatioRole(`${role}_${r}`, oid))
        );
      })
    );
  }

  hasReadOneOf(roles, organisaatio) {
    return this.hasOneOfFn(
      rb =>
        (...args) =>
          rb.hasRead(...args),
      roles,
      organisaatio
    );
  }

  hasReadAll(roles, organisaatio) {
    return this.hasAllFn(
      rb =>
        (...args) =>
          rb.hasRead(...args),
      roles,
      organisaatio
    );
  }

  hasUpdate(role, organisaatio) {
    return this.clone(
      getParentAndSelfOids(organisaatio).some(oid => {
        return (
          this.hasOrganisaatioRole(OPH_PAAKAYTTAJA_ROLE, oid) ||
          UPDATE_ROLES.some(r => this.hasOrganisaatioRole(`${role}_${r}`, oid))
        );
      })
    );
  }

  hasUpdateOneOf(roles, organisaatio) {
    return this.hasOneOfFn(
      rb =>
        (...args) =>
          rb.hasUpdate(...args),
      roles,
      organisaatio
    );
  }

  hasUpdateAll(roles, organisaatio) {
    return this.hasAllFn(
      rb =>
        (...args) =>
          rb.hasUpdate(...args),
      roles,
      organisaatio
    );
  }

  hasCreate(role, organisaatio) {
    return this.clone(
      getParentAndSelfOids(organisaatio).some(oid => {
        return (
          this.hasOrganisaatioRole(OPH_PAAKAYTTAJA_ROLE, oid) ||
          CREATE_ROLES.some(r => this.hasOrganisaatioRole(`${role}_${r}`, oid))
        );
      })
    );
  }

  hasCreateOneOf(roles, organisaatio) {
    return this.hasOneOfFn(
      rb =>
        (...args) =>
          rb.hasCreate(...args),
      roles,
      organisaatio
    );
  }

  hasCreateAll(roles, organisaatio) {
    return this.hasAllFn(
      rb =>
        (...args) =>
          rb.hasCreate(...args),
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
