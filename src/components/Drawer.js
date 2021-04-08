import { React, useState } from 'react';
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
import ExploreIcon from '@material-ui/icons/Explore';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
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


        {props.users.length > 1 ?
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
            />}
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

//"editor.fontFamily": "'Fira Code', 'Droid Sans Mono', 'monospace', monospace, 'Droid Sans Fallback'",

export default function PermanentDrawerLeft({ data }) {
    const [currentUser, setCurrentUser] = useState('');
    const [markers, setMarkers] = useState(0);

    const classes = useStyles();

    const getUserInfo = (user) => {
        setCurrentUser(user);
        console.log(currentUser);
    }

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
                <List>

                    <ListItem>
                        <ListItemIcon> <PeopleAltIcon /> </ListItemIcon>
                        <ListItemText primary="User List" />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {data.map((user) => (
                        <ListItem button key={user._id} onClick={() => setCurrentUser(user)}>
                            <ListItemIcon> <AccountCircleIcon /> </ListItemIcon>
                            <ListItemText primary={user.username} />
                        </ListItem>
                    ))}
                </List>
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
