// Uses the Radar SDK to track user's position and pass info to the server

import Radar from 'radar-sdk-js';

Radar.initialize(process.env.REACT_APP_DEV_RADAR_API_KEY);

export const registerUserInRadar = (displayName) => Radar.setUserId(displayName);

export const getUserLocation = () => {
    let userLocation = {
        latitude: null,
        longitude: null
    }
    return new Promise((resolve, _) => {
        Radar.trackOnce((err, result) => {
            if (!err) {
                userLocation.latitude = result.location.latitude;
                userLocation.longitude = result.location.longitude;
            }
            resolve(userLocation);
        });
    });
};