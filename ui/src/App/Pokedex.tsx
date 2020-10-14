import React from 'react'
import styled from 'styled-components'
import { navigate } from '@reach/router'
import Sound from 'react-sound'
import FilterInputs from './FilterInputs'
import PokemonSearchInput from './PokemonSearchInput'

const Container = styled.div`
  flex: 1;
  display: flex;
  padding: 3rem;
`

const Shadow = styled.div`
  border: 0.25rem solid #434c4e;
  border-radius: 4px;
  flex: 1;
  display: flex;
`

const Frame = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  padding: 5rem;
  background-color: #cfcfcf;
  box-shadow: 0.5rem -0.5rem 1rem rgba(0, 0, 0, 0.25) inset,
    -0.5rem 0.5rem 1rem white inset;
`

const RedButtonContainer = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #434c4e;
  width: 9rem;
`

const SearchContainer = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 30rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #434c4e;
`

const RedButton = styled.div<{ isOn?: boolean }>`
  background-color: #e94847;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  transform: scale(1) translate(0, 0);
  box-shadow: -1px 2px 1px 1px rgba(0, 0, 0, 0.66);
  transition-property: transform, box-shadow;
  transition-duration: 300ms;
  cursor: url(https://unpkg.com/nes.css/assets/cursor-click.png), pointer;

  :active {
    transform: scale(0.95) translate(-1px, 1px);
    box-shadow: -1px 2px 0 0 rgba(0, 0, 0, 0.5);
  }
`

const Grill = styled.div`
  position: absolute;
  bottom: 1.25rem;
  right: 6rem;
  height: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const GrillLine = styled.div`
  width: 5rem;
  height: 0.3rem;
  background-color: #434c4e;
  border-radius: 33%;
`

const Dots = styled.div`
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 4rem;
`

const Dot = styled.div`
  position: relative;
  width: 1rem;
  height: 1rem;
  border: 2px solid #434c4e;
  border-radius: 50%;
  background-color: #666;

  :last-child {
    width: 1.25rem;
    height: 1.25rem;
  }
`

const Glare = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    60deg,
    rgba(0, 0, 0, 0.02) calc(50% - 1px),
    rgba(0, 0, 0, 0.02),
    rgba(255, 255, 255, 0.01) calc(50% + 1px)
  );
  width: 100%;
  height: 100%;
  z-index: 100;
  pointer-events: none;
`

const Screen = styled.div<{ isOn?: boolean }>`
  position: relative;
  border: 3px solid #434c4e;
  border-radius: 4px;
  flex: 1;
  display: flex;
  background-color: ${props => (props.isOn ? '#22B1C7' : '#434c4e')};
  transition-property: background-color;
  transition-duration: ${props => (props.isOn ? '2s' : '1s')};
  transition-delay: ${props => (props.isOn ? '1s' : '1s')};
`

const Content = styled.div<{ isOn?: boolean }>`
  flex: 1;
  display: flex;
  opacity: ${props => (props.isOn ? 1 : 0)};
  transition-property: opacity;
  transition-duration: ${props => (props.isOn ? '2s' : '1s')};
  transition-delay: ${props => (props.isOn ? '1s' : '1s')};
  overflow-y: scroll;
`

const Pokedex: React.FC<{ children: (clickLink: Function) => any }> = ({
  children,
}) => {
  const [isOn, setIsOn] = React.useState(false)
  const [isButtonPressed, setIsButtonPressed] = React.useState(false)
  const [isButtonReleased, setIsButtonReleased] = React.useState(false)
  const [isLinkClicked, setIsLinkClicked] = React.useState(false)
  const [isStartupPlaying, setIsStartupPlaying] = React.useState(false)
  const [isShutdownPlaying, setIsShutdownPlaying] = React.useState(false)

  function pressButton() {
    setIsButtonPressed(true)
  }

  function handlePressButtonFinished() {
    setIsButtonPressed(false)
  }

  function releaseButton() {
    if (isOn) {
      setIsStartupPlaying(false)
      setIsShutdownPlaying(true)
    } else {
      setIsShutdownPlaying(false)
      setIsStartupPlaying(true)
    }
    setIsOn(!isOn)
    setIsButtonReleased(true)
  }

  function handleReleaseButtonFinished() {
    if (isOn) {
      navigate('/')
    }
    setIsButtonReleased(false)
  }

  function handleStartupFinished() {
    setIsStartupPlaying(false)
  }

  function handleShutdownFinished() {
    setIsShutdownPlaying(false)
  }

  function clickLink() {
    setIsLinkClicked(true)
  }

  function handleClickLinkFinished() {
    setIsLinkClicked(false)
  }

  return (
    <Container>
      <Shadow>
        <Frame>
          <Dots>
            <Dot>
              <Glare />
            </Dot>
            <Dot>
              <Glare />
            </Dot>
          </Dots>

          <RedButtonContainer>
            <RedButton
              isOn={isOn}
              onMouseDown={pressButton}
              onMouseUp={releaseButton}
            />
            On/Off
          </RedButtonContainer>

          <SearchContainer>
            Pokemon Search:
            <PokemonSearchInput />
          </SearchContainer>

          <Grill>
            <GrillLine />
            <GrillLine />
            <GrillLine />
            <GrillLine />
          </Grill>

          <div style={{ width: '400px' }}>
            <FilterInputs />
          </div>

          <Screen isOn={isOn}>
            <Content isOn={isOn}>{children(clickLink)}</Content>
            <Glare />
          </Screen>
        </Frame>
      </Shadow>
      <Sound
        url="/audio/buttonPress.mp3"
        playStatus={isButtonPressed ? 'PLAYING' : 'STOPPED'}
        autoLoad={true}
        onFinishedPlaying={handlePressButtonFinished}
      />
      <Sound
        url="/audio/buttonRelease.mp3"
        playStatus={isButtonReleased ? 'PLAYING' : 'STOPPED'}
        autoLoad={true}
        onFinishedPlaying={handleReleaseButtonFinished}
      />
      <Sound
        url="/audio/startup.mp3"
        playStatus={isStartupPlaying ? 'PLAYING' : 'STOPPED'}
        autoLoad={true}
        volume={33}
        onFinishedPlaying={handleStartupFinished}
      />
      <Sound
        url="/audio/shutdown.mp3"
        playStatus={isShutdownPlaying ? 'PLAYING' : 'STOPPED'}
        autoLoad={true}
        volume={33}
        onFinishedPlaying={handleShutdownFinished}
      />
      <Sound
        url="/audio/link.mp3"
        playStatus={isLinkClicked ? 'PLAYING' : 'STOPPED'}
        autoLoad={true}
        onFinishedPlaying={handleClickLinkFinished}
      />
    </Container>
  )
}

export default Pokedex
