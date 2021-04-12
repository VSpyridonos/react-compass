import React, { useEffect, useState } from "react";
import './App.css';
import PermanentDrawerLeft from "./components/Drawer";
import axios from 'axios';


const App = () => {


  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        'http://localhost:3001/users/all-users',
      );
      console.log(result.data)
      setData(result.data);
    };

    fetchData();
  }, []);

  if (!data) return <pre>Loading data...</pre>

  return (
    <div>
      <PermanentDrawerLeft data={data} />
    </div>
  );

}
export default App;
