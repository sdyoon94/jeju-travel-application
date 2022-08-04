import { useEffect } from 'react'

function App() {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });


  return (
    <div className="App">
      <p>app</p>
    </div>
  );
}

export default App;
