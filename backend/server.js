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
server.get('/api/activity/:activityID', getActivityId); //aktivitetsnavn på mood-siden 
server.get('/api/activities', getAllActivities); //endpoint som henter alle aktiviteter

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

//forsøg på at få navnet på en aktivitet husket til mood-siden
async function getActivityId(request, response) {
    const activity = parseInt(request.params.activityID);
    const result = await db.query(`
        SELECT * 
        FROM activities
        WHERE id=$1`, [activity]
    );
    response.json(result.rows[0]);
}

async function getAllActivities(request, response) {
    const result = await db.query(`
        SELECT *
        FROM activities
        ORDER BY id ASC`);
    response.json(result.rows);
}


//Mikkels kode som SKAL være her for at det fungerer 

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