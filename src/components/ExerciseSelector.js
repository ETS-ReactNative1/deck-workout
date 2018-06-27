import React, { Component } from "react"
import data from '../data/exercises'

export default class ExerciseSelector extends Component {
    _fieldChanged = (e) => {
        this.props.changeSuitExerciseAndEnd(this.props.suit, e.target.value)
    }

    makeKey() {
        return Array.from(arguments).join("-").replace(/[^a-zA-Z-]/, "").toLowerCase()
    }

    render() {
        var selectedExercise = this.props.exercises[this.props.suit]

        return (
            <div id="exercise-selector">
              <div className="columns">
                <div className="column col-11 col-mx-auto">
                  <form action="#">
                    { Object.keys(data).map(group => {
                        return (
                            <div
                              key={ this.makeKey("wrap", group) }
                              className="form-group">
                              <label className="form-label">{ data[group].name }</label>
                              { data[group].exercises.map(e => (
                                  <label
                                    key={ this.makeKey("ex", group, e.name) }
                                    className="form-radio">
                                    <input
                                      checked={ selectedExercise === e.name }
                                      value={ e.name }
                                      onChange={ this._fieldChanged }
                                      type="radio"
                                      name={ "select-" + this.props.suit }/>
                                    <i className="form-icon"></i> { e.name }
                                  </label>
                              ))}
                            </div>
                        )
                    })}
                  </form>
                </div>
              </div>
            </div>
        )
    }
}
