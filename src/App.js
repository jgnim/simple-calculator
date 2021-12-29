import Calculator from './components/Calculator';

function App() {
  document.body.style.backgroundColor = "#e7d4ff";
  return (
    <div className="App">
      <div id="main-content">                    
          <Calculator />          
          <div id="creator" style={{textAlign: "center"}}>
            -JG
          </div>
      </div>
    </div>
  );
}

export default App;