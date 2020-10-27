import React from 'react'
import { makeStyles, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    select: {
        margin: theme.spacing(4),
        minWidth: 120,
    },
}))

export default function SelectComponent({ label, menuItems, value, setOnChange }){

    const classes = useStyles()

    return(
        <FormControl variant="outlined" className={classes.select}>
        <InputLabel id={label}>{label}</InputLabel>
        <Select
            labelId={label}
            id={label}
            value={value}
            onChange={e => setOnChange(e.target.value)}
            label={label}
        >
            {menuItems.map(e => <MenuItem key={e} value={e}>{e}</MenuItem>)}
        </Select>
    </FormControl>
    )
}
