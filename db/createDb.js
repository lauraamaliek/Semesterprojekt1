import { upload } from 'pg-upload';
import { connect } from './connect.js';

console.log('Recreating database...');

const db = await connect();

console.log('Dropping tables...');
await db.query(`drop table if exists activities,
	moods,
	users,
	tracks,
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
	    name text not null,
	    description text not null
    )
`);

await db.query(`
    create table moods (
        id int primary key,
	    name text not null,
	    is_default boolean,
		activity_id int references activities
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


console.log('Data imported.');

await db.end();

console.log('Database recreated.');
