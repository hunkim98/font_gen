import { PixelModifyItem } from "dotting";

export const createPixelDataSquareArray = (
  rowCount: number,
  columnCount: number,
  topRowIndex: number,
  leftColumnIndex: number
): Array<Array<PixelModifyItem>> => {
  const squareArray: Array<Array<PixelModifyItem>> = [];
  for (let i = 0; i < rowCount; i++) {
    const row = [];
    for (let j = 0; j < columnCount; j++) {
      row.push({
        rowIndex: topRowIndex + i,
        columnIndex: leftColumnIndex + j,
        color: "",
      });
    }
    squareArray.push(row);
  }
  return squareArray;
};
