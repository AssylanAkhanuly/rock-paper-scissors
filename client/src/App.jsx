import "./App.css";
import Chat from "./components/Chat/Chat";
import Login from "./components/Login/Login";
import { useSelector } from "react-redux";
import Main from "./components/Main/Main";
import Background from "./components/Background/Background";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PlayersList from "./components/PlayersList/PlayersList";
function App() {
  const gameState = useSelector(({ game }) => game);
  return (
    <div className="App">
      <Header/>
      <Background>
        <Chat />
        {gameState.isConnected ? <Main /> : <Login />}
        <PlayersList/>
      </Background>
      <Footer/>
    </div>
  );
}

export default App;
