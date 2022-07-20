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
            <div id='main-header'>
                <h1>The Acme Random Movie Generator</h1>
                The Average Movie Rating Is {this.props.averageRating ? this.props.averageRating : 0} Stars out of 5
                <br/>
                
                <button onClick={this.props.createMovies}>Generate a Random Movie!</button>
   
            </div>

                { this.props.movies.length > 1 ? this.props.movies.map(movie => {
                    return (
                    <li key={movie.id}>
                        <p id='movie-name'>{movie.name}</p>
                        Rating: {movie.rating} Stars


                        <button onClick={()=>this.props.editMovies(movie, 1)}>Add to Rating</button>
                        <button onClick={()=>this.props.editMovies(movie, -1)}>Subtract from Rating</button>
                        <button id='delete-button' onClick={()=>this.props.deleteMovies(movie)}>Delete</button>
                    </li>
                    )
                }): <p id='no-movies'>There are no movies in this list! Try creating one!</p>}
        </div>
        )
    }
};

const mapStateToProps = ({ movies }) => {
    let averageRating = 1
    movies.forEach(movie => {
        averageRating += movie.rating
    });
    averageRating = averageRating / movies.length - .25
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
