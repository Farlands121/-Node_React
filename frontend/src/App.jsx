import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [input, setInput] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const obtenerPokemon = async () => {
    setJuegoTerminado(false);
    setMensaje("");
    setInput("");
    
    const idAleatorio = Math.floor(Math.random() * 150) + 1;
    
    // 1. Obtener datos básicos
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`);
    const data = await res.json();
    
    // 2. Obtener color del endpoint de species
    const resSpecies = await fetch(data.species.url);
    const dataSpecies = await resSpecies.json();

    setPokemon({
      id: data.id,
      name: data.name,
      types: data.types.map(t => t.type.name).join(", "),
      height: data.height,
      weight: data.weight,
      color: dataSpecies.color.name,
      moves: data.moves.slice(0, 3).map(m => m.move.name).join(", "),
      img: data.sprites.other.dream_world.front_default || data.sprites.front_default
    });
  };

  const verificarAdivinanza = () => {
    if (input.toLowerCase() === pokemon.name.toLowerCase()) {
      setMensaje(`¡Correcto! Es ${pokemon.name.toUpperCase()}`);
    } else {
      setMensaje(`Incorrecto, el Pokémon era ${pokemon.name.toUpperCase()}`);
    }
    setJuegoTerminado(true);
  };

  useEffect(() => { obtenerPokemon(); }, []);

  return (
    <div className="App">
      <h1>Adivina el Pokémon</h1>
      {pokemon && !juegoTerminado && (
        <div>
          <h3>Pistas:</h3>
          <p>ID: {pokemon.id} | Tipo: {pokemon.types}</p>
          <p>Color: {pokemon.color} | Altura: {pokemon.height} | Peso: {pokemon.weight}</p>
          <p>Movimientos: {pokemon.moves}</p>
          
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="¿Quién es ese Pokémon?" />
          <button onClick={verificarAdivinanza}>Enviar respuesta</button>
        </div>
      )}

      {juegoTerminado && (
        <div>
          <h2>{mensaje}</h2>
          <img src={pokemon.img} alt="pokemon" style={{ width: '200px' }} />
          <br />
          <button onClick={obtenerPokemon}>Jugar de nuevo</button>
        </div>
      )}
    </div>
  );
}

export default App;