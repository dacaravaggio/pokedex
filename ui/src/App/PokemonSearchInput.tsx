import React from 'react'
import { navigate } from '@reach/router'

const PokemonSearchInput = () => {
  let typingTimer = setTimeout(() => {}, 500)

  const getSearchResults = (inputValue: string) => {
    navigate(`/pokemon/search/${inputValue}`, {
      state: { searchText: inputValue },
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    clearTimeout(typingTimer)
    typingTimer = setTimeout(() => {
      if (val) {
        getSearchResults(val)
      }
    }, 500)
  }

  return <input type="text" onChange={handleChange} />
}

export default PokemonSearchInput
