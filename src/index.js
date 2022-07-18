import { createRoot } from 'react-dom/client';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import { setMovies, createMovies, deleteMovies, editMovies } from './store';
import store from './store';

class _App extends Component{
    componentDidMount(){
        this.props.setMovies();
    }
    
    render(){
        return(
        <div>
            <h1>The Acme Random Movie Generator</h1>
            The Average Movie Rating Is {this.props.averageRating}
            <button onClick={this.props.createMovies}>Generate a Random Movie!</button>

                { this.props.movies.map(movie => {
                    return (
                    <li key={movie.id}>
                        {movie.name} {movie.rating}
                        <button onClick={()=>this.props.deleteMovies(movie)}>Delete</button>
                        <button onClick={()=>this.props.editMovies(movie, 1)}>plus</button>
                        <button onClick={()=>this.props.editMovies(movie, -1)}>minus</button>
                    </li>
                    )
                })}
        </div>
        )
    }
};

const mapStateToProps = ({ movies }) => {
    let averageRating = 0
    movies.forEach(movie => {
        averageRating += movie.rating
    });
    averageRating = averageRating / movies.length
    return {
        movies,
        averageRating
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    setMovies: ()=> {
        dispatch(setMovies());
    },
    createMovies: ()=> {
        dispatch(createMovies());
    },
    deleteMovies: (movie)=>{
        dispatch(deleteMovies(movie))
    },
    editMovies: (movie, dir)=>{
        movie = {...movie, rating: movie.rating + dir}
        dispatch(editMovies(movie))
    }
    }
}

const App = connect(mapStateToProps, mapDispatchToProps)(_App);


const root = createRoot(document.querySelector('#root'));
root.render(<Provider store={store}><App/></Provider>);
