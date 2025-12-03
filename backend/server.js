import express from 'express';
import path from 'path';
import { connect } from '../db/connect.js';
import { play } from './player.js';


const db = await connect();
const currentTracks = new Map(); // maps partyCode to index in tracks

const port = process.env.PORT || 3003;
const server = express();

server.use(express.static('frontend'));
server.use(express.json());
server.use(onEachRequest);

server.get('/api/moods/:activityID', OnGetMoods); // Når klikker på en aktivitet (henter moods)

server.listen(port, onServerReady);



async function OnGetMoods(request, response) { //Functionen der skal hente moods
    const activity = parseInt(request.params.activityID); //
    const moods = await db.query (`
        SELECT id, name 
        FROM moods 
        JOIN mood_activity ON moods.id = mood_activity.mood_id
        WHERE mood_activity.activity_id = $1 
        `,[activity]); 
    response.json(moods.rows); // hvorfor .rows?
} 
// Vend tilbage til = $1 


function onEachRequest(request, response, next) {
    console.log(new Date(), request.method, request.url);
    next();
}


function onServerReady() {
    console.log('Webserver running on port', port);
}

async function loadTracks() {
    const dbResult = await db.query(`
        select track_id, title, artist, duration
        from   tracks
    `);
    return dbResult.rows;
}

function pickNextTrackFor(partyCode) {
    const trackIndex = Math.floor(Math.random() * tracks.length)
    currentTracks.set(partyCode, trackIndex);
    const track = tracks[trackIndex];
    play(partyCode, track.track_id, track.duration, Date.now(), () => currentTracks.delete(partyCode));
    return trackIndex;
}