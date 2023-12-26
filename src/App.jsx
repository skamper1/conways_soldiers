import { useState } from 'react'

import './style.css'

const zero_nine = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const one_ten = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const one_onehundred = zero_nine.map((k) => { return (one_ten.map((l) => { return (k * 10 + l) })) }).flat()
const [PIECE_ASSIGNMENT, PIECE_MOVEMENT, AWAITING_RESET] = [1, 2, 3]

function App() {
  const [gameState, setGameState] = useState(PIECE_ASSIGNMENT)
  const [selectedChecker, setSelectedChecker] = useState(0)
  const [checkerStartLocations, setCheckerStartLocations] = useState([55, 65])
  const [checkerCurrentLocations, setCheckerCurrentLocations] = useState([55, 65])

  const assignChecker = (locationIndex) =>{
    setCheckerStartLocations([... checkerStartLocations, locationIndex])
  }

  const removeChecker = (arrayIndex) => {
    console.log(arrayIndex)
    checkerStartLocations.splice(arrayIndex, 1)
    setCheckerStartLocations([... checkerStartLocations])
  }

  if (gameState == PIECE_ASSIGNMENT) {

    return (
      <>
        <h1>Piece Assignment State</h1>
        <Board buttonText='Play' buttonOnClick={()=>{setGameState(AWAITING_RESET)}}>
          {one_onehundred.map((locationIndex, arrayIndex) => {// squares for the board
            if(locationIndex > 50 && !checkerStartLocations.includes(locationIndex)){
              //square without a checker on event to add checker
              return(<Square key={locationIndex} locationIndex={locationIndex} selected={locationIndex == selectedChecker} onClick={()=>{assignChecker(locationIndex)}}></Square>)
            }else{
              //square without a checker on (no event)
              return(<Square key={locationIndex} locationIndex={locationIndex} selected={locationIndex == selectedChecker}></Square>)
            }
            
          }
          )}
          {checkerStartLocations.map((locationIndex, arrayIndex) => // checkers in starting locations
            <Checker key={locationIndex} locationIndex={locationIndex} onClick={()=>{removeChecker(arrayIndex)}}></Checker>
          )}
        </Board>
        
      </>
    )
  }

  if (gameState == PIECE_MOVEMENT) {
    return (
      <>
      </>
    )
  }

  if (gameState == AWAITING_RESET) {
    return (
      <>
        <h1>Awaiting Reset State</h1>
        <Board buttonText='Reset' buttonOnClick={()=>{setGameState(PIECE_ASSIGNMENT)}}>
          {one_onehundred.map((locationIndex, arrayIndex) => // squares for the board
            <Square key={locationIndex} locationIndex={locationIndex} selected={locationIndex == selectedChecker}></Square>
          )}
          {checkerStartLocations.map((locationIndex, arrayIndex) => // checkers in starting locations
            <Checker key={locationIndex} locationIndex={locationIndex}></Checker>
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


function Board({ buttonText, buttonOnClick, children }) {
  return (
    <div className='board'>
      <svg viewBox='0 0 100 100'>
        {children}
        <rect x='0' y='49.5' width='100' height='1' fill='red'></rect>
      </svg>
      <div className='play_button lime green-hover' onClick={buttonOnClick}>{buttonText}</div>
    </div>

  )
}

function Square({locationIndex, onClick}) {

  const ij = ijfromlocationindex(locationIndex)
  const o = objectprops(ij.i, ij.j)
  
  return (
    <rect x={o.x} y={o.y} fill={o.rectfill} width={o.width} height={o.width} onClick={onClick}></rect>
  )
}

function Checker({locationIndex, selected, onClick}) {
  const ij = ijfromlocationindex(locationIndex)
  const o = objectprops(ij.i, ij.j)
  if(selected){
    //#6a2150
    <circle cx={o.cx} cy={o.cy} fill='#6a2150' r={o.r} onClick={onClick} stroke="#adafaf"></circle>
  }
  return (
    <circle cx={o.cx} cy={o.cy} fill='#d10373' r={o.r} onClick={onClick} stroke="#adafaf" strokeWidth="0.5"></circle>
  )
}

export default App
