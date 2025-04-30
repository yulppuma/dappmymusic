import './App.css'
import { Welcome, Music, WebPlayback } from './components';

const App = () => {

  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 z-50 w-full bg-[#242424]">
        <Welcome/>        
      </div>
      <Music/>
      <WebPlayback/>
    </div>
  );
}

export default App