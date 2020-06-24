import React from "react";
import "./Track.css";

class Track extends React.Component {
  constructor(props) {
    super(props);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack() {
    console.log(this.props.track);
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  renderAction() {
    if (this.props.isRemoval) {
      return (
        <button className="Track-action" onClick={this.removeTrack}>
          -
        </button>
      );
    } else {
      return (
        <button className="Track-action" onClick={this.addTrack}>
          +
        </button>
      );
    }
  }

  render() {
    let track = this.props.track;
    return (
      <div>
        <div className="Track">
          <div className="Track-information">
            <h3>{track.name}</h3>
            <p>
              {track.artist} | {track.album}
            </p>
          </div>
          {this.renderAction()}
        </div>
      </div>
    );
  }
}

export default Track;
