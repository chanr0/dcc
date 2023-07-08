import React from "react";
import List from "@mui/material/List";
import {ListItem, ListItemButton, ListItemIcon, ListItemText, Radio} from "@mui/material";
import {capitalize} from "../../utils";
import Divider from "@mui/material/Divider";

interface ListProps {
    embeddings: any[];
    selected: string;
    handleToggle: (profession: string) => void;
    height: number;
    search: string;
}

const ProfessionsList: React.FunctionComponent<ListProps> = ({embeddings, selected, handleToggle, height, search}: ListProps) => {
    return (<List
        sx={{
            width: '100%',
            maxWidth: '100%',
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            maxHeight: height,
            '& ul': { padding: 0 },
            paddingBottom: 2
        }}
        subheader={<li />}
    > {(search === "" || selected.toLowerCase().includes(search.toLowerCase())) && embeddings.filter(e => e.profession === selected).map((embedding) => {
        const labelId = `checkbox-list-label-${embedding.profession}`;
        return (
            <ListItem
                key={embedding.profession}
                disablePadding
                id={embedding.profession}
                divider={true}
            >
                <ListItemButton role={undefined} onClick={() => handleToggle(embedding.profession)} dense>
                    <ListItemIcon>
                        <Radio
                            edge="start"
                            checked={true}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </ListItemIcon>
                    <ListItemText id={labelId} sx={{paddingTop: 0.5}}primary={`${capitalize(embedding.profession)}`} secondary={`${Math.round(embedding.census*100)}% Female`}/>
                </ListItemButton>
            </ListItem>
        );
    })}
        {embeddings.filter(e => {
            if (e.profession === selected) {
                return false;
            }
            if (search === '') {
                return true;
            } else {
                return e.profession.toLowerCase().includes(search.toLowerCase());
            }
        }).map((embedding) => {
            const labelId = `checkbox-list-label-${embedding.profession}`;
            return (
                <ListItem
                    key={embedding.profession}
                    disablePadding
                    id={embedding.profession}
                >
                    <ListItemButton role={undefined} onClick={() => handleToggle(embedding.profession)} dense>
                        <ListItemIcon>
                            <Radio
                                edge="start"
                                checked={selected === embedding.profession}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </ListItemIcon>
                        <ListItemText id={labelId} sx={{paddingTop: 0.5}}primary={`${capitalize(embedding.profession)}`} secondary={`${Math.round(embedding.census*100)}% Female`}/>
                    </ListItemButton>
                </ListItem>
            );
        })}
    </List>)
}

export default ProfessionsList;