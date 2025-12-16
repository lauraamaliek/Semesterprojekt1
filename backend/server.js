import express from 'express';
import { connect } from '../db/connect.js';


const db = await connect();

const port = process.env.PORT || 3003;
const server = express();

server.use(express.static('frontend'));
server.use(express.json());
server.use(onEachRequest);

server.get('/api/moods/:activityID', OnGetMoodsOnActivty); // Når klikker på en aktivitet (henter moods)
server.get('/api/activity/:activityID', getActivityId); //aktivitetsnavn på mood-siden 
server.get('/api/activities_priorities', getAllActivities2); //endpoint som henter alle aktiviteter i prioriteret rækkefølge 
server.get('/api/moods', getAllMoods);
server.post('/api/tracks-by-moods-weighted', getTracksByMoodsWeighted); //prioriterer sange som hører til mere end 1 valgt mood 

//GET henter data POST sender datta

server.listen(port, onServerReady);



async function OnGetMoodsOnActivty(request, response) { //Functionen der skal hente moods
    const activity = parseInt(request.params.activityID); //
    const moods = await db.query (`
        SELECT id, name 
        FROM moods 
        JOIN mood_activity ON moods.id = mood_activity.mood_id
        WHERE mood_activity.activity_id = $1 
        `,[activity]); 
    response.json(moods.rows); // rows for at slippe for unødig meta data, og derfor kun få inholdet vi skal bruge
} 
// $ bruges som en placeholder til en værdi i arrayet efter SQL-strengen, her er det den første værdi i arrayet [activities]

//gør så vi får navnet på en aktivitet husket til mood-siden
async function getActivityId(request, response) {
    const activity = parseInt(request.params.activityID);
    const result = await db.query(`
        SELECT * 
        FROM activities
        WHERE id=$1`, [activity]
    );
    response.json(result.rows[0]);
}

//giver alle aktiviteter, så de kan blive til knapper (sortere efter tidspunkt)
async function getAllActivities2(request, response){
    const hour = new Date().getHours();

    const result = await db.query(`
        SELECT *,
            CASE
                WHEN ${hour} >= start_hour AND ${hour} < end_hour THEN 0 
                ELSE 1
            END AS priority
        FROM activities
        ORDER by priority asc, id asc
        `);
    
    response.json(result.rows);
}

//giver alle moods 
async function getAllMoods(request,response){
    const moods = await db.query(`
        SELECT id, name
        FROM moods
    `);
    response.json(moods.rows);
}

//tracks-by-moods, altså at sange hentes efter hvilke moods der er valgt

// denne funktion vægter sangene, så dem som findes blandt flere af de valgte moods prioriteres højere

async function getTracksByMoodsWeighted(request, response) {
    try {
        const { selectedMoods } = request.body; // forventer array af mood IDs fra frontend

        if (!selectedMoods || selectedMoods.length === 0) { //! betyder "not" "====" tjekker at værdi og type er det samme på begge sider, "||" = "or"
            return response.json([]); // ingen moods valgt
        }

        const placeholders = selectedMoods.map((_, i) => `$${i + 1}`).join(','); // .join er lidt det samme som "forEach"

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
        response.json(result.rows); // returner tracks med de mest matchende først
    } catch (err) { //Hvis try ikke virker
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
