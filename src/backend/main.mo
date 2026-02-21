import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  // Include storage for video files and authorization
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Video Metadata
  public type VideoSource = {
    #blob;
    #youtube;
  };

  public type Video = {
    id : Text;
    title : Text;
    category : Text;
    genre : Text;
    keywords : [Text];
    source : VideoSource;
    blobId : ?Text;
    url : ?Text;
    metaData : Storage.ExternalBlob;
    externalThumbnail : ?Text;
  };

  module Video {
    public func compare(v1 : Video, v2 : Video) : Order.Order {
      Text.compare(v1.title, v2.title);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  public type VideoStore = {
    metaData : Video;
    file : ?Storage.ExternalBlob;
  };

  let videos = Map.empty<Text, VideoStore>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let favorites = Map.empty<Principal, Set.Set<Text>>();
  let watchlists = Map.empty<Principal, Set.Set<Text>>();

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Create Video - Changed from admin-only to user-level access
  public shared ({ caller }) func createVideo(metaData : Video) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create videos");
    };
    let videoStore : VideoStore = {
      metaData;
      file = null;
    };
    videos.add(metaData.id, videoStore);
  };

  // Get Video Metadata (public - no auth required)
  public query func getVideoMeta(id : Text) : async Video {
    switch (videos.get(id)) {
      case (?videoStore) { videoStore.metaData };
      case (null) { Runtime.trap("Video not found") };
    };
  };

  // Get All Videos (public - no auth required)
  public query func getAllVideos() : async [Video] {
    videos.values().map(func(vStore) { vStore.metaData }).toArray();
  };

  // Search Videos (public - no auth required)
  public query func searchVideos(searchText : Text) : async [Video] {
    let results = List.empty<Video>();
    for ((id, videoStore) in videos.entries()) {
      if (videoStore.metaData.title.contains(#text searchText)) {
        results.add(videoStore.metaData);
      };
    };
    results.toArray();
  };

  // Get Videos by Category (public - no auth required)
  public query func getVideosByCategory(category : Text) : async [Video] {
    let results = List.empty<Video>();
    for ((id, videoStore) in videos.entries()) {
      if (Text.equal(videoStore.metaData.category, category)) {
        results.add(videoStore.metaData);
      };
    };
    results.toArray();
  };

  // Favorites Management
  func getFavoritesForUser(userId : Principal) : Set.Set<Text> {
    switch (favorites.get(userId)) {
      case (null) {
        let set = Set.empty<Text>();
        favorites.add(userId, set);
        set;
      };
      case (?found) { found };
    };
  };

  public shared ({ caller }) func markFavorite(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage favorites");
    };
    let userFavorites = getFavoritesForUser(caller);
    if (videos.containsKey(videoId)) {
      userFavorites.add(videoId);
      favorites.add(caller, userFavorites);
    } else { Runtime.trap("Video does not exist") };
  };

  public shared ({ caller }) func unmarkFavorite(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage favorites");
    };
    let userFavorites = getFavoritesForUser(caller);
    userFavorites.remove(videoId);
    favorites.add(caller, userFavorites);
  };

  public query ({ caller }) func getUserFavorites() : async [Video] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access favorites");
    };
    let userFavorites = getFavoritesForUser(caller);
    let favoritesIter = userFavorites.map<Text, Video>(
      func(videoId) {
        switch (videos.get(videoId)) {
          case (?videoStore) { videoStore.metaData };
          case (null) { Runtime.trap("Video not found") };
        };
      }
    );
    favoritesIter.toArray();
  };

  // Watchlist Management
  func getWatchlistForUser(userId : Principal) : Set.Set<Text> {
    switch (watchlists.get(userId)) {
      case (null) {
        let set = Set.empty<Text>();
        watchlists.add(userId, set);
        set;
      };
      case (?found) { found };
    };
  };

  public shared ({ caller }) func addToWatchlist(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage watchlist");
    };
    let userWatchlist = getWatchlistForUser(caller);
    if (videos.containsKey(videoId)) {
      userWatchlist.add(videoId);
      watchlists.add(caller, userWatchlist);
    } else { Runtime.trap("Video does not exist") };
  };

  public shared ({ caller }) func removeFromWatchlist(videoId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage watchlist");
    };
    let userWatchlist = getWatchlistForUser(caller);
    userWatchlist.remove(videoId);
    watchlists.add(caller, userWatchlist);
  };

  public query ({ caller }) func getUserWatchlist() : async [Video] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access watchlist");
    };
    let userWatchlist = getWatchlistForUser(caller);

    let entriesIter = userWatchlist.map<Text, Video>(
      func(videoId) {
        switch (videos.get(videoId)) {
          case (?videoStore) { videoStore.metaData };
          case (null) { Runtime.trap("Video not found") };
        };
      }
    );
    entriesIter.toArray();
  };

  // Video Storage Integration
  public shared ({ caller }) func uploadVideo(blobId : Text, videoMeta : Video) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can upload videos");
    };

    switch (videos.get(videoMeta.id)) {
      case (?videoStore) {
        let updatedVideo = {
          videoStore with
          file = ?videoMeta.metaData;
        };
        videos.add(videoMeta.id, updatedVideo);
      };
      case (null) { Runtime.trap("Video metadata not found.") };
    };
  };
};

