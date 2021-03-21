/*
 * @Author: Martin Bruveris 
 * @Date: 2021-03-21 23:37:27 
 * @Last Modified by:   Martin Bruveris 
 * @Last Modified time: 2021-03-21 23:37:27 
 */

import { React, useState, useEffect } from 'react';
import cloneDeep from 'lodash.clonedeep';
import './boardStyle.css';
import GameCells from '../GameCellsComponent/GameCells';

export default function Board(){

    const gameBoardRowCount = 40;
    const cellCountPerRow = 70;
    const [gameStarted, setGameStarted] = useState(false);

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

    const [gameGridState, setGameGridState] = useState(generateEmptyBoard());
    const [generationCount, setGenerationCount] = useState(0);

    const updateGameGridState = (gridState) => {
        setGameGridState(gridState);
    };

    const startGame = () => {
        setGameStarted(gameStarted => !gameStarted);
    };

    const resetGame = () => {
        setGameStarted(false);
        setGenerationCount(0);
        setGameGridState(generateEmptyBoard());
    };

    useEffect(()=>{
        let boardRefreshInterval = null;
        if(gameStarted) {
            boardRefreshInterval = setInterval(()=> {
                generateNextGeneration();
            }, 100);
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