import React from 'react';
import PropTypes from 'prop-types';

const GuessForm = (props) => {
    function handleGuessInput(e) {
        e.preventDefault();
        props.onNewGuess({
            guess: e.target.guess.value,
        });
        e.target.guess.value = ''
    }


    return (
        <React.Fragment>
            <form onSubmit={handleGuessInput}>
                <label htmlFor="guess">Guess a letter: </label>
                <input type="text" id="guess" name="guess"></input>
                <button type="submit" className='guessSubmitBtn'>Submit</button>
            </form>
        </React.Fragment>
    )
}
GuessForm.propTypes = {
    guessSubmit: PropTypes.func,
};

export default GuessForm;