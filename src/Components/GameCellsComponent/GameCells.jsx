/*
 * @Author: Martin Bruveris 
 * @Date: 2021-03-21 23:37:44 
 * @Last Modified by: Martin Bruveris
 * @Last Modified time: 2021-03-21 23:38:21
 */

import { useEffect, useState } from 'react';
import cloneDeep from 'lodash.clonedeep';
import './gameCells.css';

export default function GameCells(props) {

    const updateGameGridState = props.updateGameGridState;
    const [gameGridState, setGameGridState] = useState(props.gameGridState);

    useEffect(() => {
        setGameGridState(props.gameGridState);
    }, [props.gameGridState]);

    const selectGameCell = (rowIndex, cellIndex, cell) => {
        const board = cloneDeep(gameGridState);
        board[rowIndex][cellIndex] = !cell;
        updateGameGridState(board);
    };

    return(
        <div 
            className = 'gameCellsContainer'>
            {
                gameGridState.map((row, rowIndex) => {
                    return ( 
                        <div 
                            key = {`r${rowIndex}`}
                            className = 'row'>
                            {
                                row.map((cell, cellIndex) => {
                                    return (
                                        <div 
                                            key = {`r${rowIndex}c${cellIndex}`}
                                            className = {`cell ${cell? 'alive': 'dead'}`}
                                            onClick = {() => selectGameCell(rowIndex, cellIndex, cell)}
                                        ></div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    );
};