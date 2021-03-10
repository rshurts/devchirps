import { DateTimeResolver } from "../../lib/customScalars";

const resolvers = {
  DataTime: DateTimeResolver,

  Content: {
    __resolveType(content, context, info) {
      if (content.postId) {
        return "Reply";
      }
      return "Post";
    },
  },

  Post: {
    author(post, args, context, info) {
      return { __typename: "Profile", id: post.authorProfileId };
    },
    id(post, args, context, info) {
      return post._id;
    },
    isBlocked(post, args, context, info) {
      return post.isBlocked;
    },
    replies(post, args, { dataSources }, info) {
      return dataSources.contentAPI.getPostReplies({
        ...args,
        postId: post._id,
      });
    },
  },

  Profile: {
    posts(profile, args, { dataSources }, info) {
      return dataSources.contentAPI.getOwnPosts({
        ...args,
        authorProfileId: profile.id,
      });
    },
    replies(profile, args, { dataSources }, info) {
      return dataSources.contentAPI.getOwnReplies({
        ...args,
        authorProfileId: profile.id,
      });
    },
  },

  Reply: {
    author(reply, args, context, info) {
      return { __typename: "Profile", id: reply.authorProfileId };
    },
    id(reply, args, context, info) {
      return reply._id;
    },
    isBlocked(reply, args, context, info) {
      return reply.isBlocked;
    },
    post(reply, args, { dataSources }, info) {
      return dataSources.contentAPI.getPostById(reply.postId);
    },
    postAuthor(reply, args, context, info) {
      return { __typename: "Profile", id: reply.postAuthorProfileId };
    },
  },

  Query: {
    post(parent, { id }, { dataSources }, info) {
      return dataSources.contentAPI.getPostById(id);
    },
    posts(parent, args, { dataSources }, info) {
      return dataSources.contentAPI.getPosts(args);
    },
    searchPosts(
      parent,
      { after, first, query: { text } },
      { dataSources },
      info
    ) {
      return dataSources.contentAPI.searchPosts({
        after,
        first,
        searchString: text,
      });
    },
    reply(parent, { id }, { dataSources }, info) {
      return dataSources.contentAPI.getReplyById(id);
    },
    replies(parent, args, { dataSources }, info) {
      return dataSources.contentAPI.getReplies(args);
    },
  },

  Mutation: {
    createPost(parent, { data }, { dataSources }, info) {
      return dataSources.contentAPI.createPost(data);
    },
    deletePost(parent, { where: { id } }, { dataSources }, info) {
      return dataSources.contentAPI.deletePost(id);
    },
    createReply(parent, { data }, { dataSources }, info) {
      return dataSources.contentAPI.createReply(data);
    },
    deleteReply(parent, { where: { id } }, { dataSources }, info) {
      return dataSources.contentAPI.deleteReply(id);
    },
  },
};

export default resolvers;
