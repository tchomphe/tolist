import React from 'react';
import PropTypes from 'prop-types';

export default class Tile extends React.Component {
    render(){
        return(
            <div className="card">
                <div className="card-image">
                    <img src="https://placehold.it/350x250" alt="Card image cap" />
                </div>
                <div className="card-content">
                    <span className="card-title">{this.props.title}</span>
                    <p className="card-text"><strong>Address</strong>: {this.props.address}</p>
                </div>
            </div>
        )
    }
}

Tile.propTypes = {
    title: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
}