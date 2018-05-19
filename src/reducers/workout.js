import * as types from '../actions/actionTypes';
import data from '../data/exercises';

const initialState = {
    drawCount: 3,
    exercises: {
        'hearts': '...',
        'diamonds': '...',
        'clubs': '...',
        'spades': '...'
    },
    deck: [],
    draw: [],
    discard: []
};

// This will come in handy when we support the UI to choose a fast workout
// const filterExercises = (data, fast) => {
//     return data.filter(ex => ex.fast == fast)
// }

const buildDeck = () => {
    var deck = [];
    ['hearts', 'diamonds', 'clubs', 'spades'].forEach(suit => {
        for (var i=2; i<=14; i++) {
            deck.push([suit, i]);
        }
    });

    return deck;
}

const spliceExercise = exercises => {
    return exercises.splice(Math.floor(Math.random() * exercises.length), 1)[0];
}

const cloneState = (state) => {
    return JSON.parse(JSON.stringify(state));
}

const generate = (state) => {
    var groups = Object.keys(data);
    var randGroup = groups[Math.floor(Math.random() * groups.length)];
    var localData = {};

    // slice(0) is a trick to get a clone of an array; we have to
    // create a "deep clone" of this object because splice() is
    // destructive (on purpose, to prevent duplicates)
    groups.forEach(group => localData[group] = data[group].slice(0));

    var newExercises = {
        'hearts':   spliceExercise(localData["upper"])["name"],
        'diamonds': spliceExercise(localData["lower"])["name"],
        'clubs':    spliceExercise(localData["core"])["name"],
        'spades':   spliceExercise(localData[randGroup])["name"]
    };

    // Shuffle deck
    var sortedDeck = buildDeck();
    var shuffledDeck = [];

    while (sortedDeck.length > 0) {
        shuffledDeck.push(
            sortedDeck.splice(Math.floor(Math.random() * sortedDeck.length), 1)[0]
        )
    }

    return Object.assign({}, state, {
        exercises: newExercises,
        deck: shuffledDeck,
        draw: []
    });
}

const draw = (state, drawCountPref) => {
    var newState = cloneState(state);
    var drawCount = Math.min(newState["deck"].length, state.drawCount);

    // Discard previously drawn cards, if any
    newState["discard"].concat(newState["draw"]);
    newState["draw"] = [];

    for (var i=0; i<drawCount; i++) {
        newState["draw"].push(newState["deck"].pop());
    }
    return newState;
}

const drawThree = (state) => {
    var i;
    var newState = cloneState(state);
    newState.drawCount = (newState.drawCount === 1) ? 3 : 1;

    // Toggling the draw count changes the drawn card array so that
    // downstream display components aren't responsible for filtering
    // or creating subsets of the app state. However, when you toggle
    // the draw count, you want to maintain the state of the workout
    // as much as possible.
    //
    // If you are suddenly drawing more cards, pull the extra cards
    // from the discard pile first, and from the deck second (draw as
    // few new cards as possible).
    //
    // If you are suddenly drawing fewer cards, discard the extra
    // cards.
    if (newState.drawCount > state.drawCount) {
        // Suddenly drawing more
        for (i=0; i<(newState.drawCount - state.drawCount); i++) {
            if (newState.discard.length > 0) {
                newState.draw.push(newState.discard.pop());
            } else if (newState.deck.length > 0) {
                newState.draw.push(newState.deck.pop());
            }
        }
    } else {
        // Suddenly drawing fewer
        for (i=0; i<(state.drawCount - newState.drawCount); i++) {
            newState.discard.push(newState.draw.pop());
        }
    }

    return newState;
}

export default function workout(state = initialState, action) {
    switch (action.type) {
    case types.GENERATE:
        return generate(state);

    case types.DRAW:
        return draw(state, state.drawCount);

    case types.TOGGLE_DRAW_THREE:
        return drawThree(state);

    default:
    return state;
    }
}
