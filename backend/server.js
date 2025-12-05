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

server.get('/api/moods/:activityID', OnGetMoodsOnActivty); // Når klikker på en aktivitet (henter moods)
server.get('/api/activity/:activityID', getActivityId); //aktivitetsnavn på mood-siden 
server.get('/api/activities', getAllActivities); //endpoint som henter alle aktiviteter
server.get('/api/moods', getAllMoods);
server.get('/api/tracks-by-moods', getTracksByMoods);
server.post('/api/tracks-by-moods-weighted', getTracksByMoodsWeighted);


server.listen(port, onServerReady);



async function OnGetMoodsOnActivty(request, response) { //Functionen der skal hente moods
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

async function getAllMoods(request,response){
    const moods = await db.query(`
        SELECT id, name
        FROM moods
    `);
    response.json(moods.rows);
}


//begyndelse på tracks-by-moods, altså at sange hentes efter hvilke moods der er valgt
async function getTracksByMoods(request, response) {
    try {//bruges for at fange evt. fejl og derved undgå at siden crasher 
        const { selectedMoods } = request.body; // forventer array af mood IDs fra frontend

        if (!selectedMoods || selectedMoods.length === 0) {
            return response.json([]); // ingen moods valgt
        }

        // Dynamisk placeholders til SQL
        const placeholders = selectedMoods.map((_, i) => `$${i + 1}`).join(',');

        const query = `
            SELECT DISTINCT t.id, t.title, t.artist, t.duration
            FROM tracks t
            JOIN song_mood sm ON t.id = sm.song_id
            WHERE sm.mood_id IN (${placeholders})
        `;

        const result = await db.query(query, selectedMoods);
        response.json(result.rows); // returner listen af tracks
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: 'Server error' });
    }
}

// denne funktion vægter sangene, så dem som findes blandt flere af de valgte moods prioriteres højere

async function getTracksByMoodsWeighted(request, response) {
    try {
        const { selectedMoods } = request.body; // forventer array af mood IDs fra frontend

        if (!selectedMoods || selectedMoods.length === 0) {
            return response.json([]); // ingen moods valgt
        }

        const placeholders = selectedMoods.map((_, i) => `$${i + 1}`).join(',');

        // Denne query tæller hvor mange gange hvert track matcher moods og sorterer efter antal matches
        const query = `
            SELECT t.id, t.title, t.artist, t.duration, COUNT(sm.mood_id) AS match_count
            FROM tracks t
            JOIN song_mood sm ON t.id = sm.song_id
            WHERE sm.mood_id IN (${placeholders})
            GROUP BY t.id
            ORDER BY match_count DESC, RANDOM();
        `;
        // Konverter til tal her:
        const result = await db.query(query, selectedMoods.map(Number));
        //const result = await db.query(query, selectedMoods);
        response.json(result.rows); // returner tracks med de mest matchende først
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: 'Server error' });
    }
}


//Mikkels kode som SKAL være her for at det fungerer 

function onEachRequest(request, response, next) {
    console.log(new Date(), request.method, request.url);
    next();
}


function onServerReady() {
    console.log('Webserver running on port', port);
}
/*
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
}*/