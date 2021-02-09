import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";
import gravatarUrl from "gravatar-url";

class ProfilesDataSource extends DataSource {
  constructor({ auth0, Profile }) {
    super();
    this.auth0 = auth0;
    this.Profile = Profile;
  }

  async createProfile(profile) {
    const account = await this.auth0.getUser({ id: profile.accountId });
    const avatar = gravatarUrl(account.email, { default: "mm" });
    profile.avatar = avatar;
    const newProfile = new this.Profile(profile);

    return newProfile.save();
  }

  getProfile(filter) {
    return this.Profile.findOne(filter).exec();
  }

  getProfileById(id) {
    return this.Profile.findById(id);
  }

  getProfiles() {
    return this.Profile.find({}).exec();
  }

  searchProfiles(searchString) {
    return this.Profile.find(
      { $text: { $search: searchString } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" }, _id: -1 })
      .exec();
  }

  async checkViewerFollowsProfile(viewerAccountId, profileId) {
    const viewerProfile = await this.Profile.findOne({
      accountId: viewerAccountId,
    }).exec();
    return viewerProfile.following.includes(profileId);
  }

  updateProfile(currentUsername, { description, fullName, username }) {
    if (!description && !fullName && !username) {
      throw new UserInputError("You must supply some profile data to update.");
    }

    const data = {
      ...(description && { description }),
      ...(fullName && { fullName }),
      ...(username && { username }),
    };

    return this.Profile.findOneAndUpdate({ username: currentUsername }, data, {
      new: true,
    });
  }

  async deleteProfile(username) {
    const deletedProfile = await this.Profile.findOneAndDelete({
      username,
    }).exec();
    return deletedProfile._id;
  }

  followProfile(username, profileIdToFollow) {
    return this.Profile.findOneAndUpdate(
      { username },
      { $addToSet: { following: profileIdToFollow } },
      { new: true }
    );
  }

  unfollowProfile(username, profileIdToUnfollow) {
    return this.Profile.findOneAndUpdate(
      { username },
      { $pull: { following: profileIdToUnfollow } },
      { new: true }
    );
  }

  getFollowedProfiles(following) {
    return this.Profile.find({ _id: { $in: following } }).exec();
  }
}

export default ProfilesDataSource;