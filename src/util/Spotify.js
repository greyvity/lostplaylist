let accessToken;
const client_id = "acbcaf2e6a8e419fae149c101a122282";
const redirect = "http://lostplaylist.surge.sh/";
let Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;
    const access = window.location.href.match(/access_token=([^&]*)/);
    const expire = window.location.href.match(/expires_in=([^&]*)/);

    if (access && expire) {
      accessToken = access[1];
      const expiresIn = Number(expire[1]);

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const accessURL = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect}`;
      window.location = accessURL;
    }
  },

  search: async (query) => {
    const accessToken = Spotify.getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${query}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log(response);

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);

      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map((track) => {
          return {
            name: track.name,
            id: track.id,
            uri: track.uri,
            album: track.album.name,
            artist: track.artists[0].name,
          };
        });
      }
    }
  },

  savePlaylist: async (name, trackURIs) => {
    const accessToken = await Spotify.getAccessToken();

    const headers = { Authorization: "Bearer " + accessToken };

    //userID
    const UserIdResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: headers,
    });
    const jsonUserIdResponse = await UserIdResponse.json();
    const userId = jsonUserIdResponse.id;

    //playlistId
    const playlistIdResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        headers: headers,
        method: "POST",
        body: JSON.stringify({ name: name }),
      }
    );
    const jsonPlaylistIdResponse = await playlistIdResponse.json();
    const playlistId = jsonPlaylistIdResponse.id;

    //POST track URIs
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
      {
        headers: headers,
        method: "POST",
        body: JSON.stringify({ uris: trackURIs }),
      }
    );
    const jsonTrackResponse = await tracksResponse.json();
    console.log(jsonTrackResponse);
  },
};

export default Spotify;
