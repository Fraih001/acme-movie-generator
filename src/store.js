import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import loggingMiddleware from 'redux-logger';
import axios from 'axios';

const SET_MOVIES = 'SET_MOVIES';
const CREATE_MOVIES = 'CREATE_MOVIES';
const DELETE_MOVIES = 'DELETE_MOVIES';

const _setMovies = (movies) => {
    return {
    type: SET_MOVIES,
    movies
    }
};

const _createMovies = (movie) => {
    return {
        type: CREATE_MOVIES,
        movie
    }
};

const _deleteMovies = (movie) => {
    return {
        type: DELETE_MOVIES,
        movie
    }
}

 export const setMovies = () => {
    return async(dispatch) => {
        const movies = (await axios.get('/api/movies')).data;
        dispatch(_setMovies(movies));
    }
};

export const createMovies =() => {
    return async(dispatch) => {
        const movie = (await axios.post('/api/movies')).data;
        dispatch(_createMovies(movie));
    }
}

export const deleteMovies = (movie) => {
    return async(dispatch) => {
        await axios.delete(`/api/movies/${movie.id}`);
        dispatch(_deleteMovies(movie));
    }
}

const movieReducer = (state = [], action) => {
    switch (action.type) {
        case SET_MOVIES:
            return action.movies
        case CREATE_MOVIES:
            return [...state, action.movie]
        case DELETE_MOVIES:
            return state.filter(movie => movie.id !== action.movie.id)
        default:
            return state
    }
};

const mainReducer = combineReducers({
    movies: movieReducer
});

export default createStore(mainReducer, applyMiddleware(thunk, loggingMiddleware));

