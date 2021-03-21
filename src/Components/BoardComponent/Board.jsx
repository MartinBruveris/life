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

    const [gameGridState, setGameGridState] = useState(
        Array.from(Array(gameBoardRowCount), () => {
            return new Array(cellCountPerRow).fill(false)
        })
    );

    const updateGameGridState = (gridState) => {
        setGameGridState(gridState);
    };

    const startGame = () => {
        setGameStarted(!gameStarted);
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
    };

    return (
        <>
            <button 
                onClick = {startGame}>
                {gameStarted? 'STOP' : 'START'}
            </button>
            <GameCells
                gameGridState = {gameGridState}
                updateGameGridState = {updateGameGridState}
            />
        </>
    );
}