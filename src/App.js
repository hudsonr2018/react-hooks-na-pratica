import React, { useState, useEffect } from 'react'

export default function App() {
  // Primeiro parâmetro é o nome do estado e o segundo se equivale ao this.setState
  // useState guarda o estado inicial, que pode estar vazio, neste exemplo é um array de repositórios
  const [repositories, setRepositories] = useState([])

  // Abordagem inicial para mudar um campo de nome
  // porém vamos utilizar uma função para todos os inputs
  // para que não seja necessário reescrever tanto?
  const [name, setName] = useState('')

  // Função de loading com hooks
  const [loading, setLoading] = useState(false)

  // Neste cenário de classe utilizamos o useEffect como ciclo de vida sempre que necessário
  // Aqui por exemplo nós estamos utilizando o useEffect como o componentDidMount
  // Este useEffect só será executado uma única vez na renderização deste componente.
  useEffect(() => {
    async function getRepositories() {
      const response = await fetch(
        'http://api.github.com/users/hudsonr2018/repos'
      )

      const data = await response.json()

      setRepositories(data)
    }

    setLoading(true)

    getRepositories()

    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  // Neste cenário o useEffect é utilizado como um componentWillUpdate
  // significa afirmar que sempre que repositories mudar este useEffect acontecerá.
  useEffect(() => {
    const filtered = repositories.filter(repo => repo.favorite)
    document.title = `Você tem ${filtered.length} favoritos`
  }, [repositories])

  // Esta função atribui uma propriedade de favorito booleana ao repositório
  // sempre que o usuário clicar no botão favoritar.
  function handleFavorite(id) {
    const newRepositories = repositories.map(repo =>
      repo.id === id ? { ...repo, favorite: !repo.favorite } : repo
    )

    setRepositories(newRepositories)
  }

  // O exemplo abaixo é semelhante a um EventListener utilizando hooks
  // resgatei essa abordagem do mesmo vídeo mas mantive o histórico para
  // fácil compreensão e re-leitura num só repositório
  const [location, setLocation] = useState({})

  // Função que irá facilitar a compreensão de multiplos inputs
  // Usamos uma função que recebe o tipo de input.
  // Criamos com hooks um estado com o valor do input.
  // Criamos uma const que retorna o próprio input com
  // os parâmetros necessários e já setando seu valor com setValue
  function useInput({ type }) {
    const [value, setValue] = useState('')
    const input = (
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        type={type}
      />
    )
    return [value, input]
  }

  // Agora vamos criar dois novos inputs diferente do Name para
  // visualizar o múltiplo uso do useInput ao invés do useState
  const [age, ageInput] = useInput({ type: 'number' })
  const [date, dateInput] = useInput({ type: 'date' })

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(handlePositionReceived)

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  function handlePositionReceived({ coords }) {
    const { latitude, longitude } = coords
    setLocation({ latitude, longitude })
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('name', name)
    console.log('age', age)
    console.log('date', date)
  }

  if (loading) {
    return <h1>Carregando...</h1>
  }

  return (
    <>
      <h2>Repositórios:</h2>
      <ul>
        {repositories.map(repo => (
          <li key={repo.id}>
            {repo.favorite ? (
              <p>
                <b>{repo.name}</b>
              </p>
            ) : (
              <p>{repo.name}</p>
            )}
            <button onClick={() => handleFavorite(repo.id)}>Favoritar</button>
          </li>
        ))}
      </ul>

      <h2>Geolocalização:</h2>
      <li>Latitude: {location.latitude}</li>
      <li>Longitude: {location.longitude}</li>

      <h2>Inputs:</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>
        <br />

        <label>
          Age:
          {ageInput}
        </label>
        <br />

        <label>
          Date:
          {dateInput}
        </label>
        <br />
        <input type='submit' value='Cadastrar' />
      </form>
    </>
  )
}
