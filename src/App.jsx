import { useState } from 'react'

import './style.css'

const zero_nine = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const one_ten = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const one_onehundred = zero_nine.map((k) => { return (one_ten.map((l) => { return (k * 10 + l) })) }).flat()
const [PIECE_ASSIGNMENT, PIECE_MOVEMENT, AWAITING_RESET] = [1, 2, 3]
const url = new URL(window.location.href)

function App() {
  const [gameState, setGameState] = useState(PIECE_ASSIGNMENT)
  const [selectedChecker, setSelectedChecker] = useState(0)
  const [checkerStartLocations, setCheckerStartLocations] = useState([55, 65])
  const [checkerCurrentLocations, setCheckerCurrentLocations] = useState([55, 65])
  const [highlightedSquares, setHighlightedSquares] = useState([])
  const [saveURL, setSaveURL] = useState(url.href)


  const assignChecker = (locationIndex) => {
    setCheckerStartLocations([...checkerStartLocations, locationIndex])
    setSaveURL(url.href.split("?")[0] + "?starting_checkers=" + [...checkerStartLocations, locationIndex].join(","));
  }

  const removeChecker = (arrayIndex) => {
    checkerStartLocations.splice(arrayIndex, 1)
    setCheckerStartLocations([...checkerStartLocations])
  }



  const selectChecker = (arrayIndex) => {
    setHighlightedSquares([...possibleCheckerMovements(checkerCurrentLocations[arrayIndex])])
    setSelectedChecker(checkerCurrentLocations[arrayIndex])
    console.log(`${checkerCurrentLocations[arrayIndex]} selected`)
    setGameState(PIECE_MOVEMENT)
  }

  const possibleCheckerMovements = (locationIndex) => {
    //checks if a checker can move and returns the location indexes of the squares
    const ij = ijfromlocationindex(locationIndex)
    const possibleMoves = []
    // checkleft
    if (ij.i > 2 & checkerCurrentLocations.includes(locationIndex - 1) & !checkerCurrentLocations.includes(locationIndex - 2)) {
      possibleMoves.push(locationIndex - 2)
    }
    if (ij.i < 9 & checkerCurrentLocations.includes(locationIndex + 1) & !checkerCurrentLocations.includes(locationIndex + 2)) {
      possibleMoves.push(locationIndex + 2)
    }

    if (ij.j > 2 & checkerCurrentLocations.includes(locationIndex - 10) & !checkerCurrentLocations.includes(locationIndex - 20)) {
      possibleMoves.push(locationIndex - 20)
    }

    if (ij.j < 9 & checkerCurrentLocations.includes(locationIndex + 10) & !checkerCurrentLocations.includes(locationIndex + 20)) {
      possibleMoves.push(locationIndex + 20)
    }
    return (possibleMoves)
  }

  const deselectChecker = () => {
    setSelectedChecker(0)
    setHighlightedSquares([])
    setGameState(AWAITING_RESET)
  }

  if (gameState == PIECE_ASSIGNMENT) {

    return (
      <>
        <h1>Piece Assignment State</h1>
        <Board buttonText='Play' buttonOnClick={() => { setGameState(AWAITING_RESET); setCheckerCurrentLocations([...checkerStartLocations]) }} saveURL={saveURL}>
          {one_onehundred.map((locationIndex, arrayIndex) => {// squares for the board
            if (locationIndex > 50 && !checkerStartLocations.includes(locationIndex)) {
              //square without a checker on event to add checker
              return (<Square key={locationIndex} locationIndex={locationIndex} onClick={() => { assignChecker(locationIndex) }}></Square>)
            } else {
              //square without a checker on (no event)
              return (<Square key={locationIndex} locationIndex={locationIndex} ></Square>)
            }
          }
          )}
          {checkerStartLocations.map((locationIndex, arrayIndex) => // checkers in starting locations
            <Checker key={locationIndex} locationIndex={locationIndex} onClick={() => { removeChecker(arrayIndex) }}></Checker>
          )}
        </Board>

      </>
    )
  }

  if (gameState == PIECE_MOVEMENT) {
    return (
      <>
        <h1>Piece Movement State</h1>
        <Board buttonText='Reset' buttonOnClick={() => { setGameState(PIECE_ASSIGNMENT) }}>
          {one_onehundred.map((locationIndex, arrayIndex) => // squares for the board

            <Square key={locationIndex} locationIndex={locationIndex} ></Square>)

          }
          {
            highlightedSquares.map((locationIndex, arrayIndex) =>
              <Square key={locationIndex} locationIndex={locationIndex} onClick={() => { moveChecker(locationIndex) }} highlighted={true}></Square>
            )
          }



          {checkerStartLocations.map((locationIndex, arrayIndex) => {// checkers in starting locations
            if (locationIndex == selectedChecker) {
              return (<Checker key={locationIndex} locationIndex={locationIndex} onClick={() => { deselectChecker(arrayIndex) }} selected={true}></Checker>)
            } else {
              return (<Checker key={locationIndex} locationIndex={locationIndex} onClick={() => { selectChecker(arrayIndex) }} ></Checker>)
            }
          }
          )}
        </Board>
      </>
    )
  }

  if (gameState == AWAITING_RESET) {
    return (
      <>
        <h1>Awaiting Reset State</h1>
        <Board buttonText='Reset' buttonOnClick={() => { setGameState(PIECE_ASSIGNMENT) }}>
          {one_onehundred.map((locationIndex, arrayIndex) => // squares for the board
            <Square key={locationIndex} locationIndex={locationIndex} ></Square>
          )}
          {checkerStartLocations.map((locationIndex, arrayIndex) => // checkers in starting locations
            <Checker key={locationIndex} locationIndex={locationIndex} onClick={() => { selectChecker(arrayIndex) }}></Checker>
          )}
        </Board>
      </>
    )
  }

}


const ijfromlocationindex = (locationIndex) => {
  const i = (locationIndex - 1) % 10 + 1
  const j = (locationIndex - i) / 10 + 1
  return ({ i: i, j: j })
}

const dist = 10 // the height/width of squares
function objectprops(i, j) {
  const ixeven = i % 2 == 0
  const jyeven = j % 2 == 0
  return (
    {
      cx: (i - 1) * dist + dist / 2,
      cy: (j - 1) * dist + dist / 2,
      r: dist / 3,
      x: (i - 1) * dist,
      y: (j - 1) * dist,
      rectfill: ixeven == jyeven ? '#424a52' : '#f3f3f3',
      width: dist,
      circlefill: '#d10373'
    }
  )
}


function Board({ buttonText, buttonOnClick, saveURL, children }) {
  return (
    <div className='board'>
      <svg viewBox='0 0 100 100'>
        {children}
        <rect x='0' y='49.5' width='100' height='1' fill='red'></rect>
      </svg>
      <div className='play_button lime green-hover' onClick={buttonOnClick}>{buttonText}</div>
      <a href={saveURL}>{saveURL}</a>
    </div>

  )
}

function Square({ locationIndex, onClick, highlighted }) {

  const ij = ijfromlocationindex(locationIndex)
  const o = objectprops(ij.i, ij.j)

  if (highlighted) {
    //#6a2150
    return (
      <rect x={o.x} y={o.y} fill={o.rectfill} width={o.width} height={o.width} onClick={onClick} stroke="orange"></rect>
    )
  }
  return (
    <rect x={o.x} y={o.y} fill={o.rectfill} width={o.width} height={o.width} onClick={onClick}></rect>
  )

}

function Checker({ locationIndex, selected, onClick }) {
  const ij = ijfromlocationindex(locationIndex)
  const o = objectprops(ij.i, ij.j)

  if (selected) {
    //#6a2150
    return (
      <circle cx={o.cx} cy={o.cy} fill='#6a2150' r={o.r} onClick={onClick} stroke="#adafaf"></circle>
    )
  }
  return (
    <circle cx={o.cx} cy={o.cy} fill='#d10373' r={o.r} onClick={onClick} stroke="#adafaf" strokeWidth="0.5"></circle>
  )
}

export default App
