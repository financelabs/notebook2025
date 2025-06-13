
import * as React from 'react'
import { useFetchUserPostsQuery } from './services/pokemon'

export default function userPosts() {
  // Using a query hook automatically fetches data and returns query values
  const { data, error, isLoading } = useFetchUserPostsQuery('johndoe_yandex_ru')
  // Individual hooks are also accessible under the generated endpoints:
  // const { data, error, isLoading } = pokemonApi.endpoints.getPokemonByName.useQuery('bulbasaur')

  console.log(data, error, isLoading);

  // render UI based on data and loading state
  return (
    <h1>User Posts</h1>
 );
}

