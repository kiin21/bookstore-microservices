-- Active: 1748694853334@@127.0.0.1@25432@postgres
create table shedlock(
     name varchar(64) not null,
     lock_until timestamp not null,
     locked_at timestamp not null,
     locked_by text not null,
     primary key (name)
);