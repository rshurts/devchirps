import { rule, shield, and } from "graphql-shield";

import getPermissions from "../../lib/getPermissions";

const canReadAnyProfile = rule()((parent, args, { user }, info) => {
  const permissions = getPermissions(user);
  return permissions ? permissions.includes("read:any_profile") : false;
});

const canEditOwnProfile = rule()((parent, args, { user }, info) => {
  const permissions = getPermissions(user);
  return permissions ? permissions.includes("edit:own_profile") : false;
});

const isCreatingOwnProfile = rule()(
  (parent, { data: { accountId } }, { user }, info) => {
    return user.sub === accountId;
  }
);

const isEditingOwnProfile = rule()(
  async (parent, { where: { username } }, { user, dataSources }, info) => {
    const profile = await dataSources.profilesAPI.getProfile({ username });
    const foo = profile && user.sub === profile.accountId;
    return foo;
  }
);

const permissions = shield(
  {
    Query: {
      profile: canReadAnyProfile,
      profiles: canReadAnyProfile,
      searchProfiles: canReadAnyProfile,
    },
    Mutation: {
      createProfile: and(canEditOwnProfile, isCreatingOwnProfile),
      updateProfile: and(canEditOwnProfile, isEditingOwnProfile),
      deleteProfile: and(canEditOwnProfile, isEditingOwnProfile),
      followProfile: and(canEditOwnProfile, isEditingOwnProfile),
      unfollowProfile: and(canEditOwnProfile, isEditingOwnProfile),
    },
  },
  { debug: process.env.NODE_ENV === "development" }
);

export default permissions;
