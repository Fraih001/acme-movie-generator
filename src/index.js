import { createRoot } from 'react-dom/client';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import { setMovies, createMovies, deleteMovies } from './store';
import store from './store';

class _App extends Component{
    componentDidMount(){
        this.props.setMovies();
    }
    
    render(){
        console.log(this.props)
        return(
        <div>
            <h1>The Acme Random Movie Generator</h1>
            <button onClick={this.props.createMovies}>Generate a Random Movie!</button>

                { this.props.movies.map(movie => {
                    return (
                    <li key={movie.id}>
                        {movie.name}
                        <button onClick={()=>this.props.deleteMovies(movie)}>Delete</button>
                    </li>
                    )
                })}
        </div>
        )
    }
};

const mapStateToProps = ({ movies }) => {
    return {
        movies
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
    }
    }
}

const App = connect(mapStateToProps, mapDispatchToProps)(_App);


const root = createRoot(document.querySelector('#root'));
root.render(<Provider store={store}><App/></Provider>);
