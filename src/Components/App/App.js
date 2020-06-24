import React from "react";
import SearchBar from "../SearchBar/SearchBar";
import Playlist from "../Playlist/Playlist";
import SearchResults from "../SearchResults/SearchResults";
import Spotify from "../../util/Spotify";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (
      !this.state.playlistTracks.find((savedTrack) => {
        return savedTrack.id === track.id;
      })
    ) {
      let tracks = this.state.playlistTracks;
      tracks.push(track);
      this.setState({
        playlistTracks: tracks,
      });
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks.filter(
      (savedTrack) => savedTrack.id !== track.id
    );
    this.setState({
      playlistTracks: tracks,
    });
  }

  updatePlaylistName(name) {
    console.log(name);
    this.setState({
      playlistName: name,
    });
  }

  savePlaylist = async () => {
    let trackURIs = this.state.playlistTracks.map((track) => track.uri);
    await Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      playlistName: "New Playlist",
      playlistTracks: [{}],
    });
  };

  search = async (query) => {
    const results = await Spotify.search(query);
    this.setState({
      searchResults: results,
    });
  };

  render() {
    return (
      <div>
        <h1>
          <span className="lost">Lost</span>
          <span className="highlight">PlayList</span>
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              onAdd={this.addTrack}
              tracks={this.state.searchResults}
            />{" "}
            <Playlist
              playlistTracks={this.state.playlistTracks}
              playlistName={this.state.playlistName}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
