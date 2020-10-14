import React from 'react'
import { Router, RouteComponentProps } from '@reach/router'
import Pokemon from './Pokemon'
import PokemonSearch from './PokemonSearch'
import ID from './id'

const Screens: React.FC<RouteComponentProps & { clickLink: Function }> = ({
  clickLink,
}) => (
  <Router style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <Pokemon clickLink={clickLink} path="/" />
    <PokemonSearch clickLink={clickLink} path="/search/:searchText" />
    <ID clickLink={clickLink} path=":id" />
  </Router>
)

export default Screens
