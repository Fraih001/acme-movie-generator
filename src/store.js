import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import loggingMiddleware from 'redux-logger';
import axios from 'axios';

const SET_MOVIES = 'SET_MOVIES';
const CREATE_MOVIES = 'CREATE_MOVIES';
const DELETE_MOVIES = 'DELETE_MOVIES';
const EDIT_MOVIES = 'EDIT_MOVIES';

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
};

const _editMovies = (movie) => {
    return {
        type: EDIT_MOVIES,
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

export const editMovies = (movie) => {
    return async(dispatch) => {
    try{
        movie = (await axios.put(`/api/movies/${movie.id}`, movie)).data;
        dispatch(_editMovies(movie));
    } catch(er){
        console.log(er.response.data)
        if (er.response.data === "Rating can only go up to 5" || "Rating can only go down to 1") {
            alert('Choose a number between 1 - 5!!')
        }
    }}
}

const movieReducer = (state = [], action) => {
    switch (action.type) {
        case SET_MOVIES:
            return action.movies.sort((a,b)=> b.rating - a.rating)
        case CREATE_MOVIES:
            return [...state, action.movie].sort((a,b)=> b.rating - a.rating)
        case DELETE_MOVIES:
            return state.filter(movie => movie.id !== action.movie.id)
        case EDIT_MOVIES:
            let movies = state.map(movie => movie.id !== action.movie.id ? movie : action.movie);
            movies = movies.sort((a,b)=> b.rating - a.rating);
            return [...movies]
        default:
            return state
    }
};

const mainReducer = combineReducers({
    movies: movieReducer
});

export default createStore(mainReducer, applyMiddleware(thunk, loggingMiddleware));

