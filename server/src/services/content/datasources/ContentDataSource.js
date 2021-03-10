import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";

import Pagination from "../../../lib/Pagination";

class ContentDataSource extends DataSource {
  constructor({ Post, Profile, Reply }) {
    super();
    this.Post = Post;
    this.Profile = Profile;
    this.Reply = Reply;
    this.postPagination = new Pagination(Post);
    this.replyPagination = new Pagination(Reply);
  }

  _getContentSort(sortEnum) {
    let sort = {};

    if (sortEnum) {
      const sortArgs = sortEnum.split("_");
      const [field, direction] = sortArgs;
      sort[field] = direction === "DESC" ? -1 : 1;
    }

    return sort;
  }

  async createPost({ text, username }) {
    const profile = await this.Profile.findOne({ username }).exec();

    if (!profile) {
      throw new UserInputError(
        "You must provide a valid username as the author of this post."
      );
    }

    const newPost = new this.Post({ authorProfileId: profile._id, text });

    return newPost.save();
  }

  async deletePost(id) {
    const deletedPost = await this.Post.findByIdAndDelete(id).exec();
    return deletedPost._id;
  }

  getPostById(id) {
    return this.Post.findById(id);
  }

  async getPosts({ after, before, first, last, orderBy, filter: rawFilter }) {
    let filter = {};

    if (rawFilter && rawFilter.followedBy) {
      const profile = await this.Profile.findOne({
        username: rawFilter.followedBy,
      }).exec();

      if (!profile) {
        throw new UserInputError("User with that username cannot be found.");
      }

      filter.authorProfileId = { $in: [...profile.following, profile._id] };
    }

    if (rawFilter && rawFilter.includeBlocked === false) {
      filter.blocked = { $in: [null, false] };
    }

    const sort = this._getContentSort(orderBy);
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.postPagination.getEdges(queryArgs);
    const pageInfo = await this.postPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async getOwnPosts({ after, before, first, last, orderBy, authorProfileId }) {
    const sort = this._getContentSort(orderBy);
    const filter = { authorProfileId };
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.postPagination.getEdges(queryArgs);
    const pageInfo = await this.postPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async searchPosts({ after, first, searchString }) {
    const sort = { score: { $meta: "textScore" }, _id: -1 };
    const filter = { $text: { $search: searchString } };
    const queryArgs = { after, first, filter, sort };
    const edges = await this.postPagination.getEdges(queryArgs);
    const pageInfo = await this.postPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async createReply({ postId, text, username }) {
    const post = await this.Post.findById(postId)
      .exec()
      .catch(() => {
        throw new UserInputError(
          "You must provide a valide post ID for this reply."
        );
      });
    const profile = await this.Profile.findOne({ username })
      .exec()
      .catch(() => {
        throw new UserInputError(
          "You must provide a valid username as the author of this reply."
        );
      });
    const newReply = new this.Reply({
      authorProfileId: profile._id,
      text,
      postId,
      postAuthorProfileId: post.authorProfileId,
    });

    return newReply.save();
  }

  async deleteReply(id) {
    const deletedReply = await this.Reply.findByIdAndDelete(id).exec();
    return deletedReply._id;
  }

  getReplyById(id) {
    return this.Reply.findById(id);
  }

  async getReplies({ after, before, first, last, orderBy, filter: rawFilter }) {
    const { to, from } = rawFilter;

    if (!to && !from) {
      throw new UserInputError(
        "You must provide a username to get replies to or from."
      );
    } else if (to && from) {
      throw new UserInputError("You may only provide a to or from argument.");
    }

    let filter = {};
    const profile = await this.Profile.findOne({ username: from || to }).exec();

    if (!profile) {
      throw new UserInputError("User with that username cannot be found.");
    }

    if (from) {
      filter.authorProfileId = profile._id;
    } else {
      filter.postAuthorProfileId = profile._id;
    }

    const sort = this._getContentSort(orderBy);
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.replyPagination.getEdges(queryArgs);
    const pageInfo = await this.replyPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async getPostReplies({ after, before, first, last, orderBy, postId }) {
    const sort = this._getContentSort(orderBy);
    const filter = { postId };
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.replyPagination.getEdges(queryArgs);
    const pageInfo = await this.replyPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async getOwnReplies({
    after,
    before,
    first,
    last,
    orderBy,
    authorProfileId,
  }) {
    const sort = this._getContentSort(orderBy);
    const filter = { authorProfileId };
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.replyPagination.getEdges(queryArgs);
    const pageInfo = await this.replyPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }
}

export default ContentDataSource;
