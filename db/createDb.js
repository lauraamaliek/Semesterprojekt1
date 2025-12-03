import { upload } from 'pg-upload';
import { connect } from './connect.js';

console.log('Recreating database...');

const db = await connect();

console.log('Dropping tables...');
await db.query(`drop table if exists activities,
	moods,
	users,
	tracks,
	mood_activity,
	preferences`);

console.log('All tables dropped.');

console.log('Recreating tables...');

await db.query(`
    create table users (
        id bigint primary key,
	    name text not null
    )
`);

await db.query(`
    create table activities (
        id int primary key,
	    name text not null
    )
`);

await db.query(`
    create table moods (
        id int primary key,
	    name text not null,
    )
`);

await db.query(`
    create table tracks (
        id bigint primary key,
		activity_id int references activities,
		mood_id int references moods,
		title text,
		artist text,
		bpm int
    )
`);

await db.query(`
    create table preferences (
        id int primary key,
	    user_id int references users,
		track_id bigint references tracks,
		liked boolean
    )
`);

await db.query(`
    create table mood_activity (
        activity_id int references activities,
	    mood_id int references moods
    )
`);

await db.query(`
	create table song_mood (
		song_id int references tracks, 
		mood_id int references moods
		)
`);

console.log('Tables recreated.');

console.log('Importing data from CSV files...');

await upload(db, 'db/activities.csv', `
	copy activities (id, name, description)
	from stdin
	with csv header`);

await upload(db, 'db/moods.csv', `
	copy moods (id, name, is_default, activity_id)
	from stdin
	with csv header`);

await upload(db, 'db/sang_eksempler.csv', `
	copy tracks (id, activity_id, mood_id, title, artist, bpm)
	from stdin
	with csv header`);

await upload(db, 'db/liked_fra_chat.csv', `
	copy preferences (id, user_id, track_id, liked)
	from stdin
	with csv header`);

await upload(db, 'db/mood_activity.csv', `
	copy mood_activity (activity_id, mood_id)
	from stdin
	with csv header`);

await upload(db, 'db/mood_mood.csv', `
	copy song_mood (song_id, mood_id)
	from stdin
	with csv header`);

console.log('Data imported.');

await db.end();

console.log('Database recreated.');
