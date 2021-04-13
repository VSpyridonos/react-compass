import React from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Marker } from "@react-google-maps/api";

const containerStyle = {
    width: '100%',
    height: '600px'
};

// const onLoad = marker => {
//     console.log('marker: ', marker)
// }

function NewMap({ users, markers, originalMarkers }) {
    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: 39.67310608025676, lng: 20.855661058932768 }}
                zoom={18}
                loadingElement={< div style={{ height: `100%` }} />}
                containerElement={< div style={{ height: `600px` }} />}
                mapElement={< div style={{ height: `100%` }} />}
            >
                { /* Child components, such as markers, info windows, etc. */}

                {markers.map((marker, index) => <Marker
                    key={index}
                    position={marker.props.position}
                    title={marker.props.defaultTitle}
                    animation={'DROP'}
                />)}

                {originalMarkers.map((originalMarker, index) => <Marker
                    key={index}
                    position={originalMarker.props.position}
                    title={originalMarker.props.defaultTitle}
                    animation={'DROP'}
                />)}


                <></>
            </GoogleMap>
        </LoadScript >
    )
}

export default React.memo(NewMap)