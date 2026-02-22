import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  public type VideoStoreRef = {
    metaData : Video;
  };

  let videos = Map.empty<Text, VideoStoreRef>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let favorites = Map.empty<Principal, Set.Set<Text>>();
  let watchlists = Map.empty<Principal, Set.Set<Text>>();

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

  public query ({ caller }) func getUserCount() : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can query user count");
    };
    userProfiles.size();
  };

  // VIDEO CREATION - Admin only for production content control
  public shared ({ caller }) func createVideo(metaData : Video) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create videos");
    };
    switch (videos.get(metaData.id)) {
      case (?_) {
        Runtime.trap("Video with ID '" # metaData.id # "' already exists.");
      };
      case (null) {
        let videoStoreRef : VideoStoreRef = {
          metaData;
        };
        videos.add(metaData.id, videoStoreRef);
      };
    };
  };

  // VIDEO BROWSING - Open to all users including guests
  public query ({ caller }) func getVideoMeta(id : Text) : async Video {
    // No authorization check - allow guests to view video metadata
    switch (videos.get(id)) {
      case (?videoStore) { videoStore.metaData };
      case (null) { Runtime.trap("Video not found") };
    };
  };

  public query ({ caller }) func getAllVideos() : async [Video] {
    // No authorization check - allow guests to browse all videos
    videos.values().map(func(vStore) { vStore.metaData }).toArray();
  };

  public query ({ caller }) func searchVideos(searchText : Text) : async [Video] {
    // No authorization check - allow guests to search videos
    let results = List.empty<Video>();
    for ((id, videoStore) in videos.entries()) {
      if (videoStore.metaData.title.contains(#text searchText)) {
        results.add(videoStore.metaData);
      };
    };
    results.toArray();
  };

  public query ({ caller }) func getVideosByCategory(category : Text) : async [Video] {
    // No authorization check - allow guests to filter by category
    let results = List.empty<Video>();
    for ((id, videoStore) in videos.entries()) {
      if (Text.equal(videoStore.metaData.category, category)) {
        results.add(videoStore.metaData);
      };
    };
    results.toArray();
  };

  public query ({ caller }) func getVideoDownloadLink(videoId : Text) : async Text {
    // Require authenticated user to access video content
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access video content");
    };
    switch (videos.get(videoId)) {
      case (?videoStore) {
        let video = videoStore.metaData;
        switch (video.source) {
          case (#blob) {
            switch (video.blobId) {
              case (?blobId) { blobId };
              case (null) { Runtime.trap("Blob ID not available for this video") };
            };
          };
          case (#youtube) {
            switch (video.url) {
              case (?url) { url };
              case (null) { Runtime.trap("YouTube URL not available for this video") };
            };
          };
        };
      };
      case (null) { Runtime.trap("Video not found") };
    };
  };

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
};
