import { gql } from "apollo-server";

const typeDefs = gql`
  scalar DateTime

  """
  Sorting options for the post connection.
  """
  enum PostOrderByInput {
    "Order posts ascending by creation time."
    createdAt_ASC
    "Order posts decending by creation time."
    createdAt_DESC
  }

  """
  Information about pagination in a connection.
  """
  type PageInfo {
    "The cursor to continue from when paginating forward."
    endCursor: String
    "Whether there are more items when paginated forward."
    hasNextPage: Boolean!
    "Whether there are more items when paginated backward."
    hasPreviousPage: Boolean!
    "The cursor to continue from when paginating backward."
    startCursor: String
  }

  """
  A post contain content authored by a user.
  """
  type Post {
    "The unique MongoDB document ID of the post."
    id: ID!
    "The profile of the user who authored the post."
    author: Profile!
    "The date and time the post was created."
    createdAt: DateTime!
    "Whether the post is blocked."
    isBlocked: Boolean
    "The URL of a media file associated with the content."
    media: String
    "The body content of the post (max. 256 characters.)"
    text: String!
  }

  """
  A list of post edge with pagniation information.
  """
  type PostConnection {
    "A list of post edges."
    edges: [PostEdge]
    "Information to assist with pagination."
    pageInfo: PageInfo!
  }

  """
  A single post node with its cursor.
  """
  type PostEdge {
    "A cursor for use in pagination."
    cursor: ID!
    "A post at the end of an edge."
    node: Post!
  }

  """
  Provides data to create a post.
  """
  input CreatePostInput {
    "The body content of the post (max. 256 characters.)"
    text: String!
    "The unique username of the user who authored the post."
    username: String!
  }

  """
  Provides the unique ID of an existing piece of content.
  """
  input ContentWhereUniqueInput {
    "The unique MongoDB document ID associated with the content."
    id: ID!
  }

  """
  Provides a filter on which posts may be queried.
  """
  input PostWhereInput {
    """
    The unique username of the user viewing posts by users they follow.

    Results include their own posts.
    """
    followedBy: String
    """
    Whether to include posts that have been blocked by a moderator.

    Default is 'true'.
    """
    includeBlocked: Boolean
  }

  extend type Profile @key(fields: "id") {
    id: ID! @external
    "A list of posts written by the user."
    posts(
      after: String
      before: String
      first: Int
      last: Int
      orderBy: PostOrderByInput
    ): PostConnection
  }

  extend type Query {
    "Retrieves a single post by MongoDB document ID."
    post(id: ID!): Post!
    "Retrives a list of posts."
    posts(
      after: String
      before: String
      first: Int
      last: Int
      orderBy: PostOrderByInput
      filter: PostWhereInput
    ): PostConnection
  }

  extend type Mutation {
    "Creates a new post."
    createPost(data: CreatePostInput!): Post!
    "Deletes a post."
    deletePost(where: ContentWhereUniqueInput!): ID!
  }
`;

export default typeDefs;
