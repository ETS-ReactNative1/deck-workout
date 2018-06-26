import React, { Component } from 'react';
import NavBar from './NavBar'
import VisibleCards from '../containers/VisibleCards'

export default class Settings extends Component {
    render() {
        return (
            <div>
              <NavBar noUndo={ true } />
              <VisibleCards exercises={ this.props.exercises }/>
            </div>
        );
    }
}
