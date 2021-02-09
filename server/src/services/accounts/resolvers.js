import { DateTimeResolver } from "../../lib/customScalars";

const resolvers = {
  DateTime: DateTimeResolver,

  Account: {
    __resolveReference(reference, { dataSources }, info) {
      return dataSources.accountsAPI.getAccountById(reference.id);
    },
    id(account, args, context, info) {
      return account.user_id;
    },
    createdAt(account, args, context, info) {
      return account.created_at;
    },
    isBlocked(account, args, context, info) {
      return account.blocked;
    },
    isModerator(account, args, context, info) {
      // esm doesn't work with optional chaining.
      // Refactor into a typescript project as a learning exercise.
      // return account.app_metadata?.roles.includes("moderator");
      return (
        account.app_metadata &&
        account.app_metadata.roles &&
        account.app_metadata.roles.includes("moderator")
      );
    },
  },

  Query: {
    account(parent, { id }, { dataSources }, info) {
      return dataSources.accountsAPI.getAccountById(id);
    },
    accounts(parent, args, { dataSources }, info) {
      return dataSources.accountsAPI.getAccounts();
    },
    viewer(parent, args, { dataSources, user }, info) {
      if (user && user.sub) {
        return dataSources.accountsAPI.getAccountById(user.sub);
      }
      return null;
    },
  },

  Mutation: {
    changeAccountBlockedStatus(
      parent,
      { where: { id } },
      { dataSources },
      info
    ) {
      return dataSources.accountsAPI.changeAccountBlockedStatus(id);
    },
    changeAccountModeratorRole(
      parent,
      { where: { id } },
      { dataSources },
      info
    ) {
      return dataSources.accountsAPI.changeAccountModeratorRole(id);
    },
    createAccount(
      parent,
      { data: { email, password } },
      { dataSources },
      info
    ) {
      return dataSources.accountsAPI.createAccount(email, password);
    },
    deleteAccount(parent, { where: { id } }, { dataSources }, info) {
      return dataSources.accountsAPI.deleteAccount(id);
    },
    updateAccount(parent, { data, where: { id } }, { dataSources }, info) {
      return dataSources.accountsAPI.updateAccount(id, data);
    },
  },
};

export default resolvers;