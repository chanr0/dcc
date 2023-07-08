import React, {useEffect, useState} from 'react';
import './App.scss';
import Header from "./components/Header";
import Introduction from "./components/Introduction";
import References from "./components/References";
import BiasLMs from "./components/BiasLMs";
// import TabContent from '@mui/lab';
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Visualization from './Visualization';


import {queryBackendData, queryBackendData2} from './backend/BackendQueryEngine';
import {queryBackendInt} from "./backend/BackendQueryEngine";
import { NLIDataArray } from "./components/types/NLIDataArray";
import { DataArray } from './components/types/DataArray';
import {NLIEmbeddingArray} from "./components/types/NLIEmbeddingArray";
import {ThemeProvider, createTheme} from '@mui/material/styles';


const theme = createTheme({
    palette: {
        primary: {
            main: '#91CCBE',
            light: '#f4f4f4'
        },
        secondary: {
            main: '#7f2c56',
        },
        error: {
            main: '#9e3030',
        },
        text: {
            primary: 'rgb(0,0,0)',
        },
    },
    typography: {
        fontFamily: 'Nunito',
    },
});

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

function App() {
    const [value, setValue] = React.useState(0);
    const [v, setV] = React.useState('1');

    // const [scatterData, setScatterData] = useState<DataArray>([]);
    const [scatterData, setScatterData] = useState<DataArray>([]);
    const [exampleData, setExampleData] = useState<NLIDataArray>();
    const [count, setCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [Embeddings, setEmbeddings] = useState<NLIEmbeddingArray>();
    const [maxCount, setMaxCount] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

    
      useEffect(() => {
        queryBackendInt(`data-count`).then((maxCount) => {
            setTotalCount(maxCount);
            setMaxCount(maxCount);
        });
    }, []);
    
    
    useEffect(() => {
        queryBackendData(`upload-data?count=${count}`).then((exampleData) => {
            setExampleData(exampleData);
        });
    }, [count]);
    
    const a = 0 // update when a changes.
    useEffect(() => {
        queryBackendData2(`get-data-old`).then((e) => {
            setScatterData(e)
        });
    }, [a]);
    
    const incrCount = () => {
        console.log(totalCount)
        if (count < totalCount - 1) {
            setCount(count + 1)
        }
        else {
            setCount(maxCount)
        }
    };

    const incrCountMore = (interval: number = 10) => {
        if (count < totalCount - interval) {
            setCount(Math.floor((count+interval)/interval) * interval)
        }
        else{
            setCount(maxCount)
        }

    }

    const decrCountMore = (interval: number = 10) => {
        if (count - interval > 0) {
            setCount(Math.ceil((count-interval)/interval) * interval)
        }
        else{
            setCount(0)
        }
    }
    
    const decrCount = () => {
        if (count > 0) {
            setCount(count - 1)
        }
    };
    
    
    // Get data
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
            <Tabs value={value} onChange={handleChange} aria-label="tabs" centered
                      sx={{
                        '& .MuiTabs-indicator': {
                          backgroundColor: '#C9DAFF', // Change the color here
                        },
                        '& .MuiTab-root': {
                          color: 'black', // Change the color here
                        },
                      }}>
            <Tab label="Blog Post"/>
            <Tab label="Dashboard" {...a11yProps(1)} />
            {/* <Tab icon={<PersonPinIcon />} aria-label="person" /> */}
            </Tabs>
        </Box>


        <TabPanel value={value} index={0}>
                <Header/>
                <Introduction/>
                <BiasLMs/>
                <References/>
        </TabPanel>
        <TabPanel value={value} index={1}>
        <ThemeProvider theme={theme}>
            <Box sx={{width: '100%', typography: 'body1'}}>
                {/* Hello World
                {totalCount}
                {exampleData?.map((d) => d.sentence1)[0]} */}
            <TabContext value={v}>
                    <TabPanel value={2} index={2}>
                        {exampleData && scatterData && <Visualization
                        total_count={maxCount}
                        data={exampleData}
                        scatter_data={scatterData}
                        count={count}
                        incrCount={incrCount}
                        incrCountMore={incrCountMore}
                        decrCount={decrCount}
                        decrCountMore={decrCountMore}/>}</TabPanel>
                    </TabContext>
            </Box>
    </ThemeProvider>
    </TabPanel>
    </Box>
)
}

export default App;
