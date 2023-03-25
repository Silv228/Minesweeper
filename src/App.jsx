import './App.css';
import React, { useEffect, useMemo, useState } from 'react';
import tile from './images/tile1.png'
import sprites0 from './images/tile0.png'
import sprites1 from './images/1.png'
import sprites2 from './images/2.png'
import sprites3 from './images/3.png'
import sprites4 from './images/4.png'
import sprites5 from './images/5.png'
import sprites6 from './images/6.png'
import sprites7 from './images/7.png'
import sprites8 from './images/8.png'
import flag from './images/flag.png'
import bomb from './images/bomb.png'
import detonatedBomb from './images/detB.png'
import FindBomb from './images/FindBomb.png'
import SmileStart from './images/SmileStart.png'
import SmileLose from './images/SmileLose.png'
import Question from './images/quest.png'
import c0 from './images/c0.png'
import c1 from './images/c1.png'
import c2 from './images/c2.png'
import c3 from './images/c3.png'
import c4 from './images/c4.png'
import c5 from './images/c5.png'
import c6 from './images/c6.png'
import c7 from './images/c7.png'
import c8 from './images/c8.png'
import c9 from './images/c9.png'
import SmileWOW from './images/SmileDown.png'
import SmileWin from './images/SmileWin.png'
import { Image, Layer, Stage } from 'react-konva';
import { connect } from 'react-redux';
import { UpdateMask, SetQuantBombs, winGame, SetReset, Settime, SetPick, SetWOW, SetQuantFlag, SetEnd, UpdateList, ClearField, SetBlank } from './redux/Reducer'


const Tile = React.memo( function Tile(props){
  const [image, SetImage] = useState(null)
  useEffect(() => {
    let img = new window.Image();
    img.src = props.src;
    SetImage(img)
  }, [props.src])
  const SetEnvBombs = () => {
    props.list.forEach((stroke, i) => {
      stroke.forEach((tile, j) => {
        if (tile === '*') {
          props.SetQuantBombs(i + (((i + 1) > 15) ? 0 : 1),
            j + (((j + 1) > 15) ? 0 : 1),
            i - (((i - 1) < 0) ? 0 : 1),
            j - (((j - 1) < 0) ? 0 : 1))
        }
      })
    })
  }
  const GenerateBombs = (i, j) => {
    let bombCount = 0
    while (bombCount < 40) {
      let ir = Math.floor(Math.random() * 16)
      let jr = Math.floor(Math.random() * 16)
      if (props.list[ir][jr] !== '*' && ir !== i && jr !== j) {
        bombCount += 1
        props.UpdateList(ir, jr, '*')
      }
    }
    SetEnvBombs()
    props.SetPick()
  }
  const FindNeighbors = (i, j) => {
    let listOfNeighbors = []
    for (let ic = i - (i > 0 ? 1 : 0); ic <= i + (i < 15 ? 1 : 0); ic++){
      for (let jc = j - (j > 0 ? 1 : 0); jc <= j + (j < 15 ? 1 : 0); jc++){
        if (ic !== i || jc !== j) {
          listOfNeighbors.push([ic, jc])
        }
        else continue
      }
    }
    return listOfNeighbors
  }
  const OpenTiles = (list) => {
    list.forEach((coords) => {
      const i = coords[0]
      const j = coords[1]
      if (props.list[i][j] !== '*' && props.list[i][j] === 0 && (props.mask[i][j] === 0 && props.mask[i][j] !== '') && props.mask[i][j] !== '>') {
        props.UpdateMask(i, j)
        OpenTiles(FindNeighbors(i, j))
      }
      else if (props.list[i][j] !== '*' && props.list[i][j] !== 0 && props.mask[i][j] !== '>'){
        props.UpdateMask(i, j)
      }
    })
  }
  const RegisterTile = (e) => {
    if (e.evt.button === 0) {
      let i = (props.y - 100) / 24
      let j = (props.x - 400) / 24
      if (props.isFirstPick) {
        GenerateBombs(i, j)
      }
      OpenTiles([[i, j]])
      if (props.list[i][j] !== '*') {
        let GuessedMine = 0
        props.mask.forEach((el) => {
          el.forEach((i) => {
            if (i === 0 || i === '>' || i === '?') {
              GuessedMine += 1
            }
          })
        })
        if (GuessedMine === 40) {
          props.winGame()
        }
      }
      else if (props.list[i][j] === '*' && props.mask[i][j] !== '>') {
        props.UpdateList(i, j, '#')
        props.UpdateMask(i, j)
        for (let i = 0; i <= 15; i++) {
          for (let j = 0; j <= 15; j++) {
            if (props.list[i][j] === '*' && props.mask[i][j] !== '>') {
              props.UpdateMask(i, j)
            }
            else if (props.list[i][j] === '*' && props.mask[i][j] === '>') {
              props.UpdateMask(i, j, 'x')
            }
          }
        }
        props.SetEnd()
      }
    }
    if (e.evt.button === 2 && !props.isFirstPick) {
      let i = (props.y - 100) / 24
      let j = (props.x - 400) / 24
      if (props.mask[i][j] === 0 && props.flags > 0) {
        props.UpdateMask(i, j, '>')
        props.SetQuantFlag(props.flags - 1)
      }
      else if (props.mask[i][j] === '>') {
        props.UpdateMask(i, j, '?')
        props.SetQuantFlag(props.flags + 1)
      }
      else if (props.mask[i][j] === '?') {
        props.UpdateMask(i, j, 0)
      }
    }
  }
  return (
    <Image
      onContextMenu={() => false}
      onClick={props.isClick ? RegisterTile : ''}
      onMouseDown={(e) =>
        e.evt.button === 0 ? props.SetWOW() : ''
      }
      onMouseUp={() => props.SetWOW(false)}
      x={props.x}
      y={props.y}
      image={image}
    />)
})
// Timer Component
const Timer = (props) => {
  const [quant3, SetQuant3] = useState(null)
  const [quant4, SetQuant4] = useState(null)
  const [quant5, SetQuant5] = useState(null)
  useEffect(() => {
    const timer = setTimeout(() => {
      !props.reset && props.Settime(props.time + 1)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [props.time])
  useEffect(() => {
    let quant3 = new window.Image()
    let quant4 = new window.Image()
    let quant5 = new window.Image()
    quant3.src = props.CountList[Number(props.time.toString()[2])] ? props.CountList[Number(props.time.toString()[2])] : c0
    quant4.src = props.CountList[Number(props.time.toString()[1])] ? props.CountList[Number(props.time.toString()[1])] : c0
    quant5.src = props.CountList[Number(props.time.toString()[0])]
    SetQuant3(quant3)
    SetQuant4(quant4)
    SetQuant5(quant5)
  }, [props.time])
  return(
    <Layer width={200} height = {100}>
      <Image
        x={690}
        y={50}
        image={props.time < 10 ? quant3 : props.time < 100 ? quant3 : quant5}
      />
      <Image
        x={710}
        y={50}
        image={props.time < 10 ? quant4 : props.time < 100 ? quant5 : quant4}
      />
      <Image
        x={730}
        y={50}
        image={props.time < 10 ? quant5 : props.time < 100 ? quant4 : quant3}
      />
    </Layer>
  )
}
//Main Component
const Comp = (props) => {
  const [smile, SetImage] = useState(null)
  const [quant1, SetQuant1] = useState(null)
  const [quant2, SetQuant2] = useState(null)
  useEffect(() => {
    document.addEventListener('contextmenu', function (e) { e.preventDefault() }, true)
  }, [])
  useEffect(() => {
    let smile = new window.Image()
    smile.src = props.win ? SmileWin : (props.WOW && props.isClick) ? SmileWOW : props.isClick ? SmileStart : SmileLose
    SetImage(smile)
  }, [props.WOW, props.isClick, props.win])
  useEffect(() => {
    let quant1 = new window.Image()
    let quant2 = new window.Image()
    quant1.src = CountList[Number(props.flags.toString()[0])]
    quant2.src = CountList[Number(props.flags.toString()[1])]
    SetQuant1(quant1)
    SetQuant2(quant2)
  }, [props.flags])

  const CountList = [c0, c1, c2, c3, c4, c5, c6, c7, c8, c9]
  const spritelist = [sprites0, sprites1, sprites2, sprites3, sprites4, sprites5, sprites6, sprites7, sprites8]
  let normList = new Array(16)
  props.mask.forEach((i, index) => {
    normList[index] = (i.map((j, jndex) =>
      <Tile key={`${String(index).concat(jndex)}`} SetQuantBombs={props.SetQuantBombs}
        SetPick={props.SetPick} isFirstPick={props.isFirstPick} SetQuantFlag={props.SetQuantFlag}
        ClearField={props.ClearField} SetBlank={props.SetBlank} SetEnd={props.SetEnd} SetWOW={props.SetWOW}
        isClick={props.isClick} list={props.list} mask={props.mask} flags={props.flags} WOW={props.WOW}
        x={400 + 24 * jndex} y={100 + 24 * index} win={props.win} winGame={props.winGame}
        UpdateList={props.UpdateList} UpdateMask={props.UpdateMask}
        src={props.mask[index][jndex] === '*' ? bomb : [0, 1, 2, 3, 4, 5, 6, 7, 8].includes(props.mask[index][jndex]) ?
          spritelist[props.mask[index][jndex]] : props.mask[index][jndex] === '>' ? flag : props.mask[index][jndex] === '#' ? detonatedBomb : props.mask[index][jndex] === '?' ? Question : props.mask[index][jndex] === 'x' ? FindBomb : tile}
      />
    ))
  })
  return (
    <Stage width={1000} height={600}>
      <Timer reset = {props.reset} Settime = {props.Settime} time = {props.time} CountList = {CountList}/>
      <Layer>
        <Image
          x={430}
          y={50}
          image={props.flags >= 10 ? quant1 : quant2}
        />
        <Image
          x={450}
          y={50}
          image={props.flags >= 10 ? quant2 : quant1}
        />
        <Image
          onClick={() => {
            props.ClearField()
            props.SetReset(true)
            props.Settime(0)
          }}
          x={570}
          y={50}
          image={smile}
        />
        {normList}
      </Layer>
    </Stage>
  );
}

const MapStateToProps = (state) => {
  return {
    list: state.Reducer.list,
    isFirstPick: state.Reducer.isFirstPick,
    mask: state.Reducer.mask,
    isClick: state.Reducer.isClick,
    flags: state.Reducer.flags,
    WOW: state.Reducer.WOW,
    win: state.Reducer.win,
    time: state.Reducer.time,
    reset: state.Reducer.reset
  }
}

const App = connect(MapStateToProps, { UpdateMask, Settime, SetReset, winGame, SetWOW, UpdateList, SetEnd, SetQuantFlag, SetQuantBombs, SetPick, ClearField, SetBlank })(Comp)
export default App;
