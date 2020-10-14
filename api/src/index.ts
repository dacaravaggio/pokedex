import { ApolloServer, gql, IResolvers } from 'apollo-server'
import Fuse from 'fuse.js'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import pokemon from './pokemon.json'

const pokemonValues: Pokemon[] = Object.values(pokemon)

function getPokemonByWeakness(weakness: string, pokemonValues: Pokemon[]) {
  return pokemonValues.filter(p => {
    return p.weaknesses.includes(weakness)
  })
}

function getPokemonByType(type: string, pokemonValues: Pokemon[]) {
  return pokemonValues.filter(p => {
    return p.types.includes(type)
  })
}

interface Pokemon {
  id: string
  num: string
  name: string
  img: string
  types: string[]
  weaknesses: string[]
  height: string
  weight: string
  egg: string
  prevEvolutions?: Array<{ num: string; name: string }>
  nextEvolutions?: Array<{ num: string; name: string }>
  candy?: string
  candyCount?: number
}

const typeDefs = gql`
  type Pokemon {
    id: ID!
    num: ID!
    name: String!
    img: String!
    types: [String!]!
    weaknesses: [String!]!
    height: String!
    weight: String!
    egg: String!
    prevEvolutions: [Pokemon!]!
    nextEvolutions: [Pokemon!]!
    candy: String
    candyCount: Int
  }

  type Query {
    pokemonMany(
      skip: Int
      limit: Int
      types: [String]
      weaknesses: [String]
    ): [Pokemon!]!
    pokemonSearch(name: String!): [Pokemon!]!
    pokemonOne(id: ID!): Pokemon
  }
`

const resolvers: IResolvers<any, any> = {
  Pokemon: {
    prevEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.prevEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
    nextEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.nextEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
  },
  Query: {
    pokemonMany(
      _,
      {
        skip = 0,
        limit = 999,
        types = [],
        weaknesses = [],
      }: {
        skip?: number
        limit?: number
        types?: string[]
        weaknesses?: string[]
      }
    ): Pokemon[] {
      let pokemonResults = pokemonValues

      weaknesses.forEach(weakness => {
        pokemonResults = getPokemonByWeakness(weakness, pokemonResults)
      })

      types.forEach(type => {
        pokemonResults = getPokemonByType(type, pokemonResults)
      })

      return sortBy(pokemonResults, poke => parseInt(poke.id, 10)).slice(
        skip,
        limit + skip
      )
    },

    pokemonSearch(_, { name = '' }: { name?: string }): Pokemon[] {
      if (!name) {
        return sortBy(pokemon, poke => parseInt(poke.id, 10)).slice(0, 999)
      }

      const options = {
        isCaseSensitive: false,
        includeScore: true,
        threshold: 0.6,
        keys: ['name'],
      }

      const fuse = new Fuse<Pokemon>(pokemonValues, options)

      const fuseResult = fuse.search(name)

      return fuseResult.map(d => d.item)
    },

    pokemonOne(_, { id }: { id: string }): Pokemon {
      return (pokemon as Record<string, Pokemon>)[id]
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
