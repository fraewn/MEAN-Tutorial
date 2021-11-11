const AccessControl = require('accesscontrol');
const ac = new AccessControl();

exports.roles = (function () {
  // role can edit any, since authorization is checked in an additional middleware
  // there updateOwn/ deleteOwn instead of updateAny/deleteAny is not used
  ac.grant("basic")
    .readAny("report")
    .createAny("report")
    .updateAny("report")
    .deleteAny("report")
    // for testing:
    .createAny('company')
    .update('company')
    .deleteAny('company')
    // end testing
    .readAny("company")
    .readAny("user") // can resource and role can be called the same

  ac.grant("admin")
    .extend("basic")
    .deleteAny("report")
    .createAny("company")
    .updateAny("company")
    .deleteAny("company")
    .createAny("user")
    .updateAny("user")
    .deleteAny("user")
    .attributes("canViewApi")
    .attributes("canViewSystemConfig")

  return ac;
})();
