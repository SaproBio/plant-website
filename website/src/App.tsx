import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Box, Paper, Typography } from '@mui/material';

import './App.css';

function App() {

  const [ data, setData ] = useState<any>({});

  const getData = () => {
    fetch(process.env.NODE_ENV == "development" ? 'http://localhost:8080/latest' : '/latest').then((r) => r.json()).then((data) => {
      const flatData = data?.data?.reduce((prev: any, curr: any) => ({...prev, [curr.device]: curr.value}), {})
      setData(flatData)
    })
  }
  useEffect(() => {
    getData();

    const timer = setInterval(getData, 5*1000);

    return () => {
      clearInterval(timer);
    }
  }, [])

  const renderData = () => {
    return Object.keys(data).map((key) => {
      return (
        <Box>
          {key}: {data[key]}
        </Box>
      )
    })
  }

  return (
    <div className="App">
      <Paper sx={{flex: 0.3, display: 'flex', flexDirection: 'column', padding: '6px'}}>
        {renderData()}
      </Paper>
      <Box sx={{flex: 0.7, bgcolor: 'primary.main', backgroundImage: `url('/insight.jpg')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
        {/* <Typography>Live feed goes here</Typography> */}
      </Box>
    </div>
  );
}

export default App;
