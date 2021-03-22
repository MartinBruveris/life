/*
 * @Author: Martin Bruveris 
 * @Date: 2021-03-21 23:37:27 
 * @Last Modified by: Martin Bruveris
 * @Last Modified time: 2021-03-22 21:45:30
 */

import { React, useState, useEffect } from 'react';
import cloneDeep from 'lodash.clonedeep';
import './boardStyle.css';
import GameCells from '../GameCellsComponent/GameCells';

export default function Board(){

    const gameBoardRowCount = 40;
    const cellCountPerRow = 70;
    const initialSiderValue = 5;
    const neighbourCoordinates = [
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [1, -1],
        [1, 0],
        [1, 1]
    ];

    const generateEmptyBoard = () => {
        return Array.from(Array(gameBoardRowCount), () => {
            return new Array(cellCountPerRow).fill(false)
        });
    };

    const [gameStarted, setGameStarted] = useState(false);
    const [speedSliderValue, setSpeedSliderValue] = useState(initialSiderValue);
    const [gameGridState, setGameGridState] = useState(generateEmptyBoard());
    const [generationCount, setGenerationCount] = useState(0);

    const updateSpeedSlider = (event) => {
        const sliderValue = event.target.value;
        setSpeedSliderValue(sliderValue);
    };

    const updateGameGridState = (gridState) => {
        setGameGridState(gridState);
    };

    const startGame = () => {
        setGameStarted(gameStarted => !gameStarted);
    };

    const resetGame = () => {
        setGameStarted(false);
        setGenerationCount(0);
        setSpeedSliderValue(initialSiderValue);
        setGameGridState(generateEmptyBoard());
    };

    useEffect(()=>{
        let boardRefreshInterval = null;
        if(gameStarted) {
            const speed = (11 - speedSliderValue) * 100;
            boardRefreshInterval = setInterval(()=> {
                generateNextGeneration();
            }, speed);
        }
        return () => clearInterval(boardRefreshInterval);
    });

    const generateNextGeneration = () => {
        let gridStateClone = cloneDeep(gameGridState);
        gameGridState.forEach((row, rowIndex) => {
            row.forEach((_cell, cellIndex) => {
                let liveNeighbourCount = 0;
                neighbourCoordinates.forEach(neighbourCoordinate => {
                    if (gameGridState[neighbourCoordinate[0] + rowIndex] !== undefined) {
                        let cellState = gameGridState[neighbourCoordinate[0] + rowIndex][neighbourCoordinate[1] + cellIndex];
                        if (cellState) {
                            liveNeighbourCount += 1;
                        }
                    }
                });
                if(liveNeighbourCount < 2 || liveNeighbourCount > 3) {
                    gridStateClone[rowIndex][cellIndex] = false;
                }
                if(liveNeighbourCount === 3) {
                    gridStateClone[rowIndex][cellIndex] = true;
                }
            });
        });
        setGameGridState(gridStateClone);
        setGenerationCount(generationCount => generationCount + 1);
    };

    return (
        <>
            <header>
                <p>Conways Game Of Life</p>
                <button 
                    onClick = {startGame}>
                    {gameStarted? 'STOP' : 'START'}
                </button>
                <button 
                    onClick = {resetGame}>
                    RESET
                </button>
                <label htmlFor = 'speed'>SPEED</label>
                <input 
                    type = 'range'
                    id = 'speed'
                    name = 'speed'
                    min = '1'
                    max = '10'
                    value = {speedSliderValue}
                    onChange = {updateSpeedSlider}
                    />
                <div className = 'generationCounter'>
                    {`Generation: ${generationCount}`}
                </div>
            </header>
            <main>
                <GameCells
                    gameGridState = {gameGridState}
                    updateGameGridState = {updateGameGridState}
                />
            </main>
        </>
    );
}