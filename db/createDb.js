import { upload } from 'pg-upload';
import { connect } from './connect.js';

console.log('Recreating database...');

const db = await connect();

console.log('Dropping tables...');
await db.query(`drop table if exists song_mood,
	mood_activity,
	preferences,
	tracks,
	moods,
	activities,
	users
	`);

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
	    name text not null
    )
`);

await db.query(`
    create table tracks (
        id bigint primary key,
		title text,
		artist text,
		bpm int,
		duration text
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
	copy activities (id, name)
	from stdin
	with csv header`);

await upload(db, 'db/moods.csv', `
	copy moods (id, name)
	from stdin
	with csv header`);

await upload(db, 'db/sang_eksempler.csv', `
	copy tracks (id, title, artist, bpm, duration)
	from stdin
	with csv header`);


await upload(db, 'db/mood_activity.csv', `
	copy mood_activity (activity_id, mood_id)
	from stdin
	with csv header`);

await upload(db, 'db/song_mood.csv', `
	copy song_mood (song_id, mood_id)
	from stdin
	with csv header`);

console.log('Data imported.');

await db.end();

console.log('Database recreated.');
