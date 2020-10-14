import React, { FC } from 'react'

import styled from 'styled-components'
import { RouteComponentProps, Link } from '@reach/router'
import { useQuery, gql } from '@apollo/client'
import { Container as NesContainer } from 'nes-react'

const Container = styled(NesContainer)`
  && {
    background: white;
    margin: 2rem 25%;

    ::after {
      z-index: unset;
      pointer-events: none;
    }
  }
`

const List = styled.ul`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
`

const ListItem = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1rem;

  > *:first-child {
    margin-right: 1rem;
  }
`

const POKEMON_SEARCH = gql`
  query GetByName($name: String!) {
    pokemonSearch(name: $name) {
      id
      name
      num
      img
    }
  }
`

type SearchTextType = {
  searchText: string
}

const PokemonSearch: FC<
  RouteComponentProps<SearchTextType> & {
    searchText?: string
    clickLink: Function
  }
> = ({ searchText, clickLink }) => {
  if (!searchText) {
    searchText = ''
  }

  const { loading, error, data } = useQuery(POKEMON_SEARCH, {
    variables: { name: searchText },
  })

  const pokemonList:
    | Array<{ id: string; name: string; img: string; num: string }>
    | undefined = data?.pokemonSearch

  if (loading) {
    return <p>Loading...</p>
  }

  if (error || !pokemonList) {
    return <p>Error!</p>
  }

  return (
    <Container rounded>
      <List>
        {pokemonList.length > 0 &&
          pokemonList.map(pokemon => (
            <Link
              to={`/pokemon/${pokemon.id}`}
              state={{ returnPath: `/search/${searchText}` }}
              key={pokemon.id}
              onMouseDown={clickLink as any}
            >
              <ListItem>
                <img src={pokemon.img} alt={pokemon.name} />
                {pokemon.name} - {pokemon.num}
              </ListItem>
            </Link>
          ))}

        {pokemonList.length === 0 && <div>sad trombone...no results</div>}
      </List>
    </Container>
  )
}

export default PokemonSearch
