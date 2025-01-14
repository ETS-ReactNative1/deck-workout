import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import DeckWorkout from '../components/DeckWorkout'
import VisibleSettings from '../containers/VisibleSettings'
import Help from '../components/Help'

const Root = ({ store }) => (
    <Provider store={store}>
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={DeckWorkout} />
            <Route path="/settings" component={VisibleSettings} />
            <Route path="/help" component={Help} />
            <Route path="/:seed" component={DeckWorkout} />
          </Switch>
        </div>
      </Router>
    </Provider>
);

// Root.propTypes = {
//     store: PropTypes.object.isRequired
// };

export default Root;
