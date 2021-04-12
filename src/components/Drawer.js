import { React, useState, useEffect, useReducer } from 'react';
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

import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} from "react-google-maps";

const drawerWidth = 240;


// Map


const MapWithAMarker = withScriptjs(withGoogleMap(props =>

    <GoogleMap
        defaultZoom={17}
        defaultCenter={{ lat: 39.67310608025676, lng: 20.855661058932768 }}
    >
        {/* <Marker
            position={{ lat: 39.67310608025676, lng: 20.855661058932768 }}
            defaultLabel={String(props.users)}
        /> */}


        {/* {props.users.length > 1000 ?
            props.users.map(user => (
                user.measurements.map(measurement =>
                    <Marker
                        key={measurement._id}
                        position={{ lat: parseFloat(measurement.xHatNew[0]), lng: parseFloat(measurement.xHatNew[1]) }}
                        defaultTitle={String(user.username)}
                    />
                )
            ))
            : <Marker
                position={{ lat: 39.67310608025676, lng: 20.855661058932768 }}
                defaultLabel={String(props.markers)}
            />} */}

        {console.log(props)}
        {props.markers.map(marker => marker)}
        {/* {console.log(props.markers)} */}
    </GoogleMap>
));




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


    const [olderTours, setOlderTours] = useState(false);

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
        setMarkers([]);

        const results = await axios.get(`http://localhost:3001/users/${user}`);
        await setCurrentUser(results.data);
        let userMarkers = await results.data.measurements.map(measurement =>
            <Marker
                key={measurement._id}
                position={{ lat: parseFloat(measurement.xHatNew[0]), lng: parseFloat(measurement.xHatNew[1]) }}
                defaultTitle={String(results.data.username)}
            />
        );


        setMarkers(userMarkers);
        //console.log(userMarkers);
        // console.log(markers);


        //setCurrentUser(user);
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

                <form onSubmit={handleSubmit} style={{ 'margin-left': '15px' }}>

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
                                control={<Checkbox
                                    color="primary"
                                    checked={olderTours}
                                    value={olderTours}
                                    onChange={(e) => setOlderTours(e.currentTarget.checked)}
                                    inputProps={{ 'aria-label': 'Checkbox A' }}
                                    labelplacement="end"
                                />}
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
                <MapWithAMarker
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&v=3.exp&libraries=geometry,drawing,places`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `600px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    users={currentUser ? currentUser : data}
                    markers={markers}
                />

                <br />
                <Typography paragraph>
                    Currently showing tour info for user: {currentUser.username}
                </Typography>

            </main>
        </div>
    );
}
