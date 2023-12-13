import React from "react";
import GuessForm from "./GuessForm";
import GamePage from "./GamePage";
import EndScenario from "./EndScenario";
import PlayButton from "./PlayButton";
import wordList from "./words";
import hang5 from './../assets/img/hang5.png';
import hang4 from './../assets/img/hang4.png';
import hang3 from './../assets/img/hang3.png';
import hang2 from './../assets/img/hang2.png';
import hang1 from './../assets/img/hang1.png';
import hang0 from './../assets/img/hang0.png';

import { useSelector } from 'react-redux';

import { inGameSelector } from "../redux/inGameSlice";
import { gameOverSelector } from "../redux/gameOverSlice";
import { wrongGuessesSelector } from "../redux/wrongGuessesSlice";
import { correctGuessesSelector } from "../redux/correctGuessesSlice";
import { guessesRemainingSelector } from "../redux/guessesRemainingSlice";
import { displayAnswerSelector } from "../redux/displayAnswerSlice";
import { endStateSelector } from "../redux/endStateSlice";
import { errorSelector } from "../redux/errorSlice";
import { answerSelector } from "../redux/answerSlice";

import { useDispatch } from 'react-redux';

import { setAnswer } from './../redux/answerSlice';
import { addCorrectLetter, returnDefaultCorrect } from "../redux/correctGuessesSlice";
import { userDisplay } from "../redux/displayAnswerSlice";
import { setEndTrue, setEndFalse } from "../redux/endStateSlice";
import { displayError } from "../redux/errorSlice";
import { setGameOverTrue, setGameOverFalse } from "../redux/gameOverSlice";
import { decrementGuess, returnTo6 } from "../redux/guessesRemainingSlice";
import { setStartTrue } from "../redux/inGameSlice";
import { addWrongLetter, returnDefaultWrong } from "../redux/wrongGuessesSlice";


const Control = () => {
    const dispatch = useDispatch();

    const inGame = useSelector(inGameSelector);
    const gameOver = useSelector(gameOverSelector);
    const wrongGuesses = useSelector(wrongGuessesSelector);
    const correctGuesses = useSelector(correctGuessesSelector);
    const guessesRemaining = useSelector(guessesRemainingSelector);
    const displayAnswer = useSelector(displayAnswerSelector);
    const endState = useSelector(endStateSelector);
    const error = useSelector(errorSelector);
    const answer = useSelector(answerSelector);

    const newGame = () => {
        dispatch(setStartTrue()); // setInGame(true);
        dispatch(returnDefaultWrong()); //setWrongGuesses([]);
        dispatch(returnDefaultCorrect());  //setCorrectGuesses([]);
        dispatch(returnTo6()); //setGuessesRemaining(6);
        dispatch(userDisplay([]));  //setDisplayAnswer([]);
        dispatch(setEndFalse());  //setEndState(false);
        dispatch(setGameOverFalse()); //setGameOver(false);

        const randomNumber = Math.floor(Math.random() * wordList.length);
        const randoAnswer = (wordList[randomNumber]).toUpperCase().split('')
        dispatch(setAnswer(randoAnswer)) //setAnswer(randoAnswer);
        let underscores = [];
        for (let i = 0; i < randoAnswer.length; i++) {
            underscores.push('_');
        }
        // console.log(randoAnswer);
        dispatch(userDisplay(underscores));    //setDisplayAnswer(underscores);
    };

    const getIndices = (array, letter) => {
        let indices = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i] === letter) {
                indices.push(i);
            }
        }
        return indices;
    }

    const handleGuess = (guess) => {
        dispatch(displayError('')); //setError('');
        if ((guess.guess).length === 1) {
            const upperGuess = (guess.guess).toUpperCase();
            if (correctGuesses.includes(upperGuess) || wrongGuesses.includes(upperGuess)) {
                dispatch(displayError("You've already guessed that letter")); //setError("You've already guessed that letter")
            } else if (answer.includes(upperGuess)) {
                const displayAnswerIndex = getIndices(answer, upperGuess);
                let displayInProgress = [...displayAnswer]
                for (let i = 0; i < displayAnswerIndex.length; i++) {
                    displayInProgress.splice(displayAnswerIndex[i], 1, upperGuess)
                }
                const newCorrectGuessArray = [...correctGuesses, upperGuess];
                dispatch(addCorrectLetter(newCorrectGuessArray)); //setCorrectGuesses(newCorrectGuessArray);
                dispatch(userDisplay(displayInProgress)); //setDisplayAnswer(displayInProgress)
                if (answer.join('') === displayInProgress.join('')) {
                    dispatch(setGameOverTrue()); //setGameOver(true)
                    dispatch(setEndTrue()); //setEndState(true)
                }
            } else {
                console.log(answer);
                const newWrongGuessArray = [...wrongGuesses, upperGuess];
                dispatch(addWrongLetter(newWrongGuessArray)); //setWrongGuesses(newWrongGuessArray);
                dispatch(decrementGuess()); //setGuessesRemaining(guessesRemaining - 1)
                if (guessesRemaining === 1) {
                    dispatch(setGameOverTrue()); //setGameOver(true)
                }
            }
        } else {
            dispatch(displayError("Please enter a single letter")); //setError("Please enter a single letter");
        }

    }
    let visibleState = null;

    const setSrc = () => {
        let src;
        if (guessesRemaining === 6) {
            src = hang0;
            return src;
        } else if (guessesRemaining === 5) {
            src = hang1;
            return src;
        } else if (guessesRemaining === 4) {
            src = hang2;
            return src;
        } else if (guessesRemaining === 3) {
            src = hang3;
            return src;
        } else if (guessesRemaining === 2) {
            src = hang4;
            return src;
        } else {
            src = hang5;
            return src;
        }
    }

    if (gameOver) {
        visibleState =
            <>
                <GamePage incorrectGuesses={wrongGuesses} guessesLeft={guessesRemaining} displayAnswer={displayAnswer} />
                <EndScenario endState={endState} click={newGame} unsolved={answer} />
                
            </>
    } else if (inGame) {
        visibleState = (
            <>
                <GamePage
                    incorrectGuesses={wrongGuesses}
                    guessesLeft={guessesRemaining}
                    displayAnswer={displayAnswer}
                    dubLetResponse={error} />
                <GuessForm onNewGuess={handleGuess} />
                <img src={setSrc()} alt="hangman" />
            </>
        );
    } else {
        visibleState = <PlayButton click={newGame} />;
    }

    return <React.Fragment>{visibleState}</React.Fragment>;
};

export default Control;