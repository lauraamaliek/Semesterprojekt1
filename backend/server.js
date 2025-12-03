import express from 'express';
import path from 'path';
import { connect } from '../db/connect.js';
import { play } from './player.js';


const db = await connect();
const tracks = await loadTracks();
const currentTracks = new Map(); // maps partyCode to index in tracks

const port = process.env.PORT || 3003;
const server = express();

server.use(express.static('frontend'));
server.use(express.json());
server.use(onEachRequest);
server.get('/api/party/:partyCode/currentTrack', onGetCurrentTrackAtParty);
server.get(/\/[a-zA-Z0-9-_/]+/, onFallback); // serve index.html on any other simple path
server.listen(port, onServerReady);

server.get('/api/moods/:activityID', OnGetMoods); // Når klikker på en aktivitet (henter moods)



async function OnGetMoods(request, response) { //Functionen der skal hente moods
    const activity = request.params.activity; //
    const moods = await db.query (`
        SELECT id, name 
        FROM moods 
        JOIN mood_activity ON moods.id = mood_activity.mood_id
        WHERE mood_activity.activity_id = $1 
        `,[activity]); 
    response.json(moods.rows); // hvorfor .rows?
} 
// Vend tilbage til = $1 


async function onGetCurrentTrackAtParty(request, response) {
    const partyCode = request.params.partyCode;
    let trackIndex = currentTracks.get(partyCode);
    if (trackIndex === undefined) {
        trackIndex = pickNextTrackFor(partyCode);
    }
    const track = tracks[trackIndex];
    response.json(track);
}

function onEachRequest(request, response, next) {
    console.log(new Date(), request.method, request.url);
    next();
}

async function onFallback(request, response) {
    response.sendFile(path.join(import.meta.dirname, '..', 'frontend', 'index.html'));
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