import React, { FC, useEffect, useRef, useState } from 'react'
import { navigate } from '@reach/router'
import styled from 'styled-components'

const FilterContainer = styled.div`
  display: flex;
  flex: 1;
  margin-right: 15px;
`

const FilterList = styled.div`
  flex: 1;

  &:nth-child(1) {
    margin-right: 20px;
  }
`

const FilterInputs: FC = () => {
  const inputRef = useRef<HTMLInputElement[]>([])

  const [data, setData] = useState<string[]>([])

  useEffect(() => {
    const pokemonAttributes = [
      'Bug',
      'Dragon',
      'Electric',
      'Fighting',
      'Fire',
      'Flying',
      'Ghost',
      'Grass',
      'Ground',
      'Ice',
      'Normal',
      'Poison',
      'Psychic',
      'Rock',
      'Water',
    ]

    inputRef.current = new Array(pokemonAttributes.length * 2)

    setData(pokemonAttributes)
  }, [])

  const filterInputHandler = (event: React.FormEvent) => {
    event.preventDefault()

    const filterInputs = inputRef.current

    let types: string[] = []
    let weaknesses: string[] = []

    for (let filterInput of filterInputs) {
      if (filterInput.checked) {
        if (filterInput.dataset!.filtertype === 'type') {
          types = [...types, filterInput.dataset!.filtername] as string[]
        } else {
          weaknesses = [
            ...weaknesses,
            filterInput.dataset!.filtername,
          ] as string[]
        }
      }
    }

    navigate('/pokemon', { state: { filters: { types, weaknesses } } })
  }

  return (
    <form onSubmit={filterInputHandler}>
      <FilterContainer>
        <FilterList>
          <h2>Types</h2>
          <hr />
          {data.map((element, i) => (
            <div key={`type-${element}`} style={{ marginBottom: '4px' }}>
              <input
                style={{
                  display: 'inline',
                  width: 'auto',
                  verticalAlign: 'middle',
                  position: 'relative',
                  bottom: '3px',
                }}
                type="checkbox"
                ref={el => (inputRef.current[i] = el as HTMLInputElement)}
                id={`type-${element}`}
                data-filtertype="type"
                data-filtername={element}
              ></input>
              <label
                htmlFor={`type-${element}`}
                style={{ display: 'inline', width: 'auto', marginLeft: '10px' }}
              >
                {element}
              </label>
            </div>
          ))}
        </FilterList>

        <FilterList>
          <h2>Weaknesses</h2>
          <hr />
          {data.map((element, i) => (
            <div key={`weakness-${element}`} style={{ marginBottom: '4px' }}>
              <input
                style={{
                  display: 'inline',
                  width: 'auto',
                  verticalAlign: 'middle',
                  position: 'relative',
                  bottom: '3px',
                }}
                type="checkbox"
                ref={el =>
                  (inputRef.current[i + data.length] = el as HTMLInputElement)
                }
                id={`weakness-${element}`}
                data-filtertype="weakness"
                data-filtername={element}
              ></input>
              <label
                htmlFor={`weakness-${element}`}
                style={{ display: 'inline', width: 'auto', marginLeft: '10px' }}
              >
                {element}
              </label>
            </div>
          ))}
        </FilterList>
      </FilterContainer>
      <button type="submit" style={{ marginTop: '15px' }}>
        Filter Full Results
      </button>
    </form>
  )
}

export default FilterInputs
