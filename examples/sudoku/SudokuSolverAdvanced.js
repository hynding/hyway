export class SSA {
    static get allowedBitFields() {
        return [
            1 << -1,
            1,
            1 << 1,
            1 << 2,
            1 << 3,
            1 << 4,
            1 << 5,
            1 << 6,
            1 << 7,
            1 << 8,
        ]
    };
    
    static get allAllowed() {
      return SSA.arraySum(SSA.allowedBitFields);
    }

    static solve(board) {
        // a dummy board solve to force the JIT compiler to precompile everything. (much faster)
        // SSA.solveBoardMain([ 
        //   [0,0,0,0,0,0,0,0,0]
        //   [0,0,0,0,0,0,0,0,0]
        //   [0,0,0,0,0,0,0,0,0]
        //   [0,0,0,0,0,0,0,0,0]
        //   [0,0,0,0,0,0,0,0,0]
        //   [0,0,0,0,0,0,0,0,0]
        //   [0,0,0,0,0,0,0,0,0]
        //   [0,0,0,0,0,0,0,0,0]
        //   [0,0,0,0,0,0,0,0,0]
        // ]);
        
        // A delay to allow JIT compilation to run.
    //     try {
		// 	Thread.sleep(1000);
		// } catch (InterruptedException e1) {
		// 	e1.printStackTrace();
		// }
        
        if (board.length > 0) {
            try {
                // final int[][] board = readBoard(new File(args[0]));
                
                const timeBefore = Date.now();

                const placedNumbers = SSA.solveBoardMain(board);
                
                const timeAfter = Date.now();
                
                if (placedNumbers == 81) {
                    console.log("Solved in " + (timeAfter - timeBefore) + " ms.");
                }
                else {
                    console.log("Can't be solved. Attempted in " + (timeAfter - timeBefore) + " ms.");
                }
                
                SSA.printBoard(board);
            } catch (e) {
              console.log("Error", e)
            }
        }
        else {
            // System.out.println("Vous devez fournir le chemin du fichier contenant le problème.");
        }
    }

    static solveBoardMain(board) {
        // final int[][] allowedValues = new int[9][9];
        const allowedValues = new Array(9).fill(null).map(() => new Array(9).fill(SSA.allAllowed));
        // console.log('allowedValues', JSON.parse(JSON.stringify(allowedValues)));
        let placedNumberCount = 0;
      
        
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (board[x][y] > 0) {
                    allowedValues[x][y] = 0;
                    SSA.applyAllowedValuesMask(board, allowedValues, x, y);
                    placedNumberCount++;
                }
            }
        }
        

        return SSA.solveBoard(board, allowedValues, placedNumberCount);
    }

    static solveBoard(board, allowedValues, placedNumberCount) {
      
        let lastPlacedNumbersCount = 0;
        console.log('placedNumberCount', placedNumberCount, allowedValues);
      
        while (placedNumberCount - lastPlacedNumbersCount > 3 && placedNumberCount < 68 && placedNumberCount > 10) {
        // while (placedNumberCount < 56) {
            lastPlacedNumbersCount = placedNumberCount;
            placedNumberCount += SSA.moveNothingElseAllowed(board, allowedValues);
            placedNumberCount += SSA.moveNoOtherSectionAllowed(board, allowedValues);
            placedNumberCount += SSA.moveNoOtherRowOrColumnAllowed(board, allowedValues);
            SSA.applyOneParameterConstraints(board, allowedValues);
        }
      
        if (placedNumberCount < 81) {
          console.log('brute forcing...', placedNumberCount, placedNumberCount - lastPlacedNumbersCount, JSON.parse(JSON.stringify(board)));
            const bruteForcedBoard = SSA.attemptBruteForce(board, allowedValues, placedNumberCount);

            if (bruteForcedBoard != null) {
                placedNumberCount = 0;
                
                for (let x = 0; x < 9; x++) {
                    for (let y = 0; y < 9; y++) {
                        board[x][y] = bruteForcedBoard[x][y];
                        
                        if (bruteForcedBoard[x][y] > 0) {
                            placedNumberCount++;
                        }
                    }
                }
            }
        }
        
        return placedNumberCount;
    }

    static attemptBruteForce(board, allowedValues, placedNumberCount) {

        for (let x = 0; x < 9; x++) {
            const allowedValuesRow = allowedValues[x];
            const boardRow = board[x];
            
            for (let y = 0; y < 9; y++) {
                if (boardRow[y] == 0) {
                    for (let value = 1; value <= 9; value++) {
                        if ((allowedValuesRow[y] & SSA.allowedBitFields[value]) > 0) {
                            const testBoard = SSA.copyGameMatrix(board);
                            const testAllowedValues = SSA.copyGameMatrix(allowedValues);
                            SSA.setValue(testBoard, testAllowedValues, value, x, y);
                            
                            const placedNumbers = SSA.solveBoard(testBoard, testAllowedValues, placedNumberCount + 1);
                            
                            if (placedNumbers == 81) {
                                return testBoard;
                            }
                        }
                    }
                    
                    return null;
                }
            }
        }
        
        return null;
    }

    static moveNoOtherRowOrColumnAllowed(board, allowedValues) {
        
        let moveCount = 0;
        
        for (let value = 1; value <= 9; value++) {
            const allowedBitField = SSA.allowedBitFields[value];
            
            for (let x = 0; x < 9; x++) {
                let allowedY = -1;
                const allowedValuesRow = allowedValues[x];
                
                for (let y = 0; y < 9; y++) {
                    if ((allowedValuesRow[y] & allowedBitField) > 0) {
                        if (allowedY < 0) {
                            allowedY = y;
                        }
                        else {
                            allowedY = -1;
                            break;
                        }
                    }
                }
                
                if (allowedY >= 0) {
                    SSA.setValue(board, allowedValues, value, x, allowedY);
                    moveCount++;
                }
            }
            
            for (let y = 0; y < 9; y++) {
                let allowedX = -1;
                
                for (let x = 0; x < 9; x++) {
                    if ((allowedValues[x][y] & allowedBitField) > 0) {
                        if (allowedX < 0) {
                            allowedX = x;
                        }
                        else {
                            allowedX = -1;
                            break;
                        }
                    }
                }
                
                if (allowedX >= 0) {
                    SSA.setValue(board, allowedValues, value, allowedX, y);
                    moveCount++;
                }
            }
        }

        return moveCount;
    }

    static moveNoOtherSectionAllowed(board, allowedValues) {

        let moveCount = 0;
        
        for (let sectionX = 0; sectionX < 9; sectionX += 3) {
            for (let sectionY = 0; sectionY < 9; sectionY += 3) {
                for (let value = 1; value <= 9; value++) {
                    let allowedX = -1;
                    let allowedY = -1;
                    const sectionEndX = sectionX + 3;
                    const sectionEndY = sectionY + 3;
                    const allowedBitField = SSA.allowedBitFields[value];
                    
                    // section:
                    for (let x = sectionX; x < sectionEndX; x++) {
                        const allowedValuesRow = allowedValues[x];
                        let breakSection = false;
                        for (let y = sectionY; y < sectionEndY; y++) {
                            if ((allowedValuesRow[y] & allowedBitField) > 0) {
                                if (allowedX < 0) {
                                    allowedX = x;
                                    allowedY = y;
                                }
                                else {
                                    allowedX = -1;
                                    // break section;
                                    breakSection = true;
                                    break;
                                }
                            }
                        }
                        if (breakSection) {
                            break;
                        }
                    }
                    
                    if (allowedX >= 0) {
                        SSA.setValue(board, allowedValues, value, allowedX, allowedY);
                        moveCount++;
                    }
                }
            }
        }

        return moveCount;
    }

    static moveNothingElseAllowed(board, allowedValues) {
        
        let moveCount = 0;
        
        for (let x = 0; x < 9; x++) {
            const allowedValuesRow = allowedValues[x];
            
            for (let y = 0; y < 9; y++) {
                const currentAllowedValues = allowedValuesRow[y];
                if (SSA.countSetBits(currentAllowedValues) == 1) {
                    SSA.setValue(board, allowedValues, SSA.getLastSetBitIndex(currentAllowedValues), x, y);
                    moveCount++;
                }
            }
        }
    
        return moveCount;
    }

    static applyOneParameterConstraints(board, allowedValues) {
        for (let value = 1; value <= 9; value++) {
            const allowedBitField = SSA.allowedBitFields[value];
            
            for (let sectionX = 0; sectionX < 9; sectionX += 3) {
                for (let sectionY = 0; sectionY < 9; sectionY += 3) {
                    let xConstraint = -1;
                    let yConstraint = -1;
                    
                    const sectionEndX = sectionX + 3;
                    const sectionEndY = sectionY + 3;
                    
                    for (let x = sectionX; x < sectionEndX; x++) {
                        const allowedValuesRow = allowedValues[x];
                        
                        for (let y = sectionY; y < sectionEndY; y++) {
                            if ((allowedValuesRow[y] & allowedBitField) > 0) {
                                if (xConstraint == -1) {
                                    xConstraint = x;
                                }
                                else if (xConstraint != x) {
                                    xConstraint = -2;
                                }
                                
                                if (yConstraint == -1) {
                                    yConstraint = y;
                                }
                                else if (yConstraint != y) {
                                    yConstraint = -2;
                                }
                            }
                        }
                    }
                    
                    if (xConstraint >= 0) {
                        const allowedValuesConstrainedRow = allowedValues[xConstraint];
                        // console.log('allowedValuesConstrainedRow1', [...allowedValuesConstrainedRow])
                        
                        for (let maskApplyY = 0; maskApplyY < sectionY; maskApplyY++) {
                            allowedValuesConstrainedRow[maskApplyY] &= ~allowedBitField;
                        }
                        
                        for (let maskApplyY = sectionY + 3; maskApplyY < 9; maskApplyY++) {
                            allowedValuesConstrainedRow[maskApplyY] &= ~allowedBitField;
                        }
                        // console.log('allowedValuesConstrainedRow', [...allowedValuesConstrainedRow])
                    }
                    
                    if (yConstraint >= 0) {
                        for (let maskApplyX = 0; maskApplyX < sectionX; maskApplyX++) {
                            allowedValues[maskApplyX][yConstraint] &= ~allowedBitField;
                        }
                        
                        for (let maskApplyX = sectionX + 3; maskApplyX < 9; maskApplyX++) {
                            allowedValues[maskApplyX][yConstraint] &= ~allowedBitField;
                        }
                    }
                }
            }
        }
    }
    
    static applyAllowedValuesMask(board, allowedValues, x, y) {

        const mask = ~SSA.allowedBitFields[board[x][y]];
        
        for (let maskApplyX = 0; maskApplyX < 9; maskApplyX++) {
            allowedValues[maskApplyX][y] &= mask;
        }
        
        const allowedValuesRow = allowedValues[x];
        
        for (let maskApplyY = 0; maskApplyY < 9; maskApplyY++) {
            allowedValuesRow[maskApplyY] &= mask;
        }
        
        let sectionX1 = 0;
        let sectionX2 = 0;
        
        switch (x) {
            case 0:
                sectionX1 = x + 1;
                sectionX2 = x + 2;
                break;
            case 1:
                sectionX1 = x - 1;
                sectionX2 = x + 1;
                break;
            case 2:
                sectionX1 = x - 2;
                sectionX2 = x - 1;
                break;
            case 3:
                sectionX1 = x + 1;
                sectionX2 = x + 2;
                break;
            case 4:
                sectionX1 = x - 1;
                sectionX2 = x + 1;
                break;
            case 5:
                sectionX1 = x - 2;
                sectionX2 = x - 1;
                break;
            case 6:
                sectionX1 = x + 1;
                sectionX2 = x + 2;
                break;
            case 7:
                sectionX1 = x - 1;
                sectionX2 = x + 1;
                break;
            case 8:
                sectionX1 = x - 2;
                sectionX2 = x - 1;
                break;
                
        }

        let sectionY1 = 0;
        let sectionY2 = 0;
        
        switch (y) {
            case 0:
                sectionY1 = y + 1;
                sectionY2 = y + 2;
                break;
            case 1:
                sectionY1 = y - 1;
                sectionY2 = y + 1;
                break;
            case 2:
                sectionY1 = y - 2;
                sectionY2 = y - 1;
                break;
            case 3:
                sectionY1 = y + 1;
                sectionY2 = y + 2;
                break;
            case 4:
                sectionY1 = y - 1;
                sectionY2 = y + 1;
                break;
            case 5:
                sectionY1 = y - 2;
                sectionY2 = y - 1;
                break;
            case 6:
                sectionY1 = y + 1;
                sectionY2 = y + 2;
                break;
            case 7:
                sectionY1 = y - 1;
                sectionY2 = y + 1;
                break;
            case 8:
                sectionY1 = y - 2;
                sectionY2 = y - 1;
                break;
        }
        
        let allowedValuesRow1 = allowedValues[sectionX1];
        let allowedValuesRow2 = allowedValues[sectionX2];
        
        allowedValuesRow1[sectionY1] &= mask;
        allowedValuesRow1[sectionY2] &= mask;
        allowedValuesRow2[sectionY1] &= mask;
        allowedValuesRow2[sectionY2] &= mask;
    }

    static setValue(board, allowedValues, value, x, y) {
        board[x][y] = value;
        allowedValues[x][y] = 0;
        SSA.applyAllowedValuesMask(board, allowedValues, x, y);
    }
    
    static copyGameMatrix(matrix) {
        return matrix.map(row => row.slice());
    }

    static printBoard(board) {
        console.log(board)
    }

    static getLastSetBitIndex(value) {
        let bitIndex = 0;
        
        while (value > 0) {
            bitIndex++;
            value >>= 1;
        }
        
        return bitIndex;
    }

    static countSetBits(value) {
        let count = 0;
        
        while (value > 0) {
            value = value & (value - 1);
            count++;
        }
        
        return count;
    }

    static arraySum(array) {
        let sum = 0;
        
        array.forEach(value => {
            sum += value;
        });
        
        return sum;
    }

    // static readBoard(final File file) {
    //     final int[][] board = new int[9][9];
    //     final BufferedReader input =  new BufferedReader(new FileReader(file));

    //     try {
    //         String line = null; //not declared within while loop
    //         int lineIndex = 0;
            
    //         while (( line = input.readLine()) != null) {
    //             if (line.length() != 9 || lineIndex > 8) {
    //                 throw new FileFormatException();
    //             }
            
    //             for (int letterIndex = 0; letterIndex < 9; letterIndex++) {
    //                 final int value = Character.getNumericValue(line.charAt(letterIndex));
                    
    //                 if (value < 0 || value > 9) {
    //                     throw new FileFormatException();
    //                 }
                    
    //                 board[letterIndex][lineIndex] = value;
    //             }
                
    //             lineIndex++;
    //         }
            
    //         if (lineIndex != 9) {
    //             throw new FileFormatException();
    //         }
    //     }
    //     finally {
    //         input.close();
    //     }
        
    //     return board;
    // }
}