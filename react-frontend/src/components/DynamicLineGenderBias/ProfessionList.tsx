import React from "react";
import List from "@mui/material/List";
import {ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Radio} from "@mui/material";
import {capitalize} from "../../utils";

interface ListProps {
    embeddings: any[];
    selected: string[];
    handleToggle: (profession: string) => void;
    search: string;
    referenceProfession: string;
}

const ProfessionsList: React.FunctionComponent<ListProps> = ({embeddings, selected, handleToggle, search, referenceProfession}: ListProps) => {

    return (<List
        sx={{
            width: '100%',
            maxWidth: '100%',
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 150,
            '& ul': { padding: 0 },
            paddingBottom: 2
        }}
        subheader={<li />}
    >
        {embeddings.filter(e => {
            if (e.profession === selected) {
                return false;
            }
            if (e.profession === referenceProfession) {
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
                            <Checkbox
                                edge="start"
                                checked={selected.includes(embedding.profession)}
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