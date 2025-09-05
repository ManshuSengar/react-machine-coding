import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [results, setResults] = useState([]);
  const [value, setValue] = useState("");
  const [cache,setCache]=useState({});
  const [showResults,setShowResults]=useState(false);
  const fetchData = async () => {
    try {
      if(cache[value]){
         console.log("cache value",cache);
         setResults(cache[value]);
         return;
      }
      const response = await fetch(
        `https://dummyjson.com/recipes/search?q=${value}`
      );
      const result = await response.json();
      setResults(result?.recipes);
      setCache((prev)=>({...prev,[value]:result?.recipes}));
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    const debounce=setTimeout(fetchData,400);
    return ()=>{
      clearInterval(debounce);
    }
   
  }, [value]);

  return (
    <div className="app-container">
      <h1>Auto Complete </h1>
      <div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="input-search"
          onFocus={()=>setShowResults(true)}
          onBlur={()=>setShowResults(false)}
        ></input>
      </div>
      {showResults && (
      <div className="result-container">
        {results.map((r) => (
          <span className="results" key={r.id}>
            {r.name}
          </span>
        ))}
      </div>)}
    </div>
  );
}

export default App;


// css
.app-container{
  text-align: center;
}

.input-search {
    width: 500px;
    padding: 9px;
}

.result-container{
   width: 500px;
   margin: auto;
   border: 1px solid black;
    text-align: left;
    overflow-y: scroll;
    max-height: 500px;
}

.results{
  display: block;
 
  padding: 10px;
  
}

.results:hover{
  background-color: rgb(199, 196, 196);
  cursor: pointer;
}

