import React, {useState} from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

const DataChoiceComponent = ({onChoiceMade} : {onChoiceMade: any}) => {
  const [sentences, setSentences] = useState([""]);

  const handleChange = (e : any, index: number) => {
    setSentences(sentences.map((sentence, idx) => index === idx ? e.target.value : sentence));
  }

  const handleChoice = (e : any) => {
    const filteredSent = sentences.filter(sentence => sentence !== "");
    if (filteredSent.length !== 0) {
      onChoiceMade(filteredSent);
      setSentences([]);
    }         
  }

  return (
    <div style={{width: "50em"}}>
        <div style={{padding: "1em 0"}}>
      <label htmlFor="data-choice">
        Enter a sentence you want to project to the latent space:
      </label>
        </div>
        {sentences.map((sentence, index) => {
          return (
            <TextField style={{width: "100%", marginBottom: "15px"}} 
            value={sentence} 
            onChange={(e) => handleChange(e, index)}
            placeholder="Enter a new sentence..."
            InputProps={{endAdornment: (
            <IconButton onClick={() => {
              setSentences(sentences.filter((sentence, idx) => idx !== index));
            }} size="large">
              <DeleteIcon fontSize="small" />
            </IconButton>)}}/>
          );
        })}
        <div>
          <IconButton style={{marginBottom: "1em", marginTop: "-0.5em"}} onClick={() => {setSentences([...sentences, ""])}} size="large">
            <AddIcon fontSize="large"/>
          </IconButton>
        </div>
      <Button variant="contained" onClick={handleChoice}>
        Visualize embedding
      </Button>
    </div>
  );
}

export default DataChoiceComponent;