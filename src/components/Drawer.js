import { React, useState, useEffect, useReducer } from 'react';
import NewMap from './NewMap';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import ExploreIcon from '@material-ui/icons/Explore';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

import {
    withScriptjs,
    withGoogleMap,
    Marker,
} from "react-google-maps";

const drawerWidth = 240;


const googleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const mapStyles = {
    width: '100%',
    height: '100%',
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
}));


export default function PermanentDrawerLeft({ data }) {
    const [currentUser, setCurrentUser] = useState('');
    const [markers, setMarkers] = useState([]);
    const [originalMarkers, setOriginalMarkers] = useState([]);
    const [olderTours, setOlderTours] = useState(false);
    const [olderMarkers, setOlderMarkers] = useState([]);

    const classes = useStyles();

    const getUserInfo = (user) => {
        setCurrentUser(user);
        console.log(currentUser);
    }

    const [formInput, setFormInput] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            user: ""
        }
    );




    const handleSubmit = async (e) => {
        e.preventDefault();

        let { user } = formInput;

        if (user === 'All Users') {
            let resultsAll = await axios.get('http://localhost:3001/users/all-users');
            await setCurrentUser('All Users');
            console.log(resultsAll);
        }

        const results = await axios.get(`http://localhost:3001/users/${user}`);
        setCurrentUser(results.data);
        let userMarkers = await results.data.measurements.map(measurement =>
            <Marker
                key={measurement._id}
                position={{ lat: parseFloat(measurement.xHatNew[0]), lng: parseFloat(measurement.xHatNew[1]) }}
                defaultTitle={`${String(results.data.username)}'s position on:\n${measurement.createdAt.slice(0, 10)}, ${measurement.createdAt.slice(11, 19)}\n\nlat: ${parseFloat(measurement.xHatNew[0])}\nlng: ${parseFloat(measurement.xHatNew[1])}`}
            />
        );

        console.log(results.data)

        setMarkers(userMarkers);

        let userOriginalMarkers = await results.data.measurements.map(measurement =>
            <Marker
                key={measurement._id}
                position={{ lat: parseFloat(measurement.xHatOriginal[0]), lng: parseFloat(measurement.xHatOriginal[1]) }}
                defaultTitle={`Original Data:\n${String(results.data.username)}'s position on:\n${measurement.createdAt.slice(0, 10)}, ${measurement.createdAt.slice(11, 19)}\n\nlat: ${parseFloat(measurement.xHatOriginal[0])}\nlng: ${parseFloat(measurement.xHatOriginal[1])}`}
            />
        );

        setOriginalMarkers(userOriginalMarkers);

        if (!olderTours) return;

        let allOlderMarkers = []
        if (results.data.olderMeasurements.length) {
            for (let measurements of results.data.olderMeasurements) {
                let userOlderMarkers = await measurements.map(measurement =>
                    <Marker
                        key={measurement._id}
                        position={{ lat: parseFloat(measurement.xHatNew[0]), lng: parseFloat(measurement.xHatNew[1]) }}
                        defaultTitle={`Older measurement:\n${String(results.data.username)}'s position on:\n${measurement.createdAt.slice(0, 10)}, ${measurement.createdAt.slice(11, 19)}\n\nlat: ${parseFloat(measurement.xHatOriginal[0])}\nlng: ${parseFloat(measurement.xHatOriginal[1])}`}
                    />
                );
                allOlderMarkers.push(userOlderMarkers)
            }

        }
        setOlderMarkers(allOlderMarkers);

        console.log(markers);
        console.log(originalMarkers);
        console.log(olderMarkers);



    };






    const handleInput = e => {
        const user = e.target.name;
        const newValue = e.target.value;
        setFormInput({ [user]: newValue });
    };







    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        <span style={{ fontSize: '36px' }}>C<ExploreIcon className="material-icons" style={{ fontSize: '28px' }} />mpass</span>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left"
            >
                <div className={classes.toolbar} />

                <Divider />
                <br />
                <br />

                <form onSubmit={handleSubmit} style={{ 'marginLeft': '15px' }}>

                    <FormControl className={classes.formControl}>
                        <InputLabel id="user-select-label">Select a user</InputLabel>
                        <Select
                            name="user"
                            labelId="user-select-label"
                            id="user-select"
                            native
                            value={formInput.user ? formInput.user : ''}
                            onChange={handleInput}
                        >
                            <option aria-label="None" value="" />
                            <option value="All Users" style={{ 'fontWeight': 'bold' }}>All Users</option>
                            {data.map((user) => (
                                <option key={user._id} value={user._id}>{user.username}</option>
                            ))}

                        </Select>
                    </FormControl>

                    <br />
                    <br />
                    <FormControl component="fieldset">
                        <FormGroup aria-label="position" row>
                            <FormControlLabel
                                value="end"
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={olderTours}
                                        value={olderTours}
                                        onChange={(e) => setOlderTours(e.currentTarget.checked)}
                                        inputProps={{ 'aria-label': 'Checkbox A' }}
                                        labelplacement="end"
                                    />
                                }
                                label="Also display older tours"
                                labelPlacement="end"
                            />
                        </FormGroup>
                    </FormControl>
                    <br />
                    <br />
                    <Button variant="contained" color="primary" type="submit">
                        DISPLAY
                    </Button>


                </form>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <NewMap
                    users={currentUser ? currentUser : data}
                    markers={markers}
                    originalMarkers={originalMarkers}
                    olderTours={olderTours}
                    olderMarkers={olderMarkers}

                />

                <br />
                <br />

                <Typography paragraph>
                    Currently showing tour info for user: {currentUser.username ?? currentUser}
                </Typography>

            </main>
        </div>
    );
}
