1. Create the Database

`CREATE DATABASE streamflix;`
<img width="1445" height="172" alt="image" src="https://github.com/user-attachments/assets/d7f13b33-2647-4d1b-b9fc-77823cfe8b88" />

2. Create Tables

`CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT
);`

<img width="1463" height="58" alt="image" src="https://github.com/user-attachments/assets/b38d16b0-3704-447f-8a3a-96eeeec107f7" />

`CREATE TABLE content (
    content_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
    views_in_millions DECIMAL(10,2),
    release_year INTEGER,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);`

<img width="1441" height="144" alt="image" src="https://github.com/user-attachments/assets/243ca33b-82d6-40ce-9382-48c7d542f5ae" />

3. Insert Data

<img width="1462" height="111" alt="image" src="https://github.com/user-attachments/assets/88ff2b7a-8d71-4156-8e00-1e123497dbb3" />
<img width="1458" height="159" alt="image" src="https://github.com/user-attachments/assets/55694726-e7ee-49e1-849c-54f51b3641fa" />

4. Query 1: Basic JOIN - Show All Content with Categories

`SELECT CO.content_id, CO.title, CA.category_name FROM CONTENT CO INNER JOIN CATEGORY CA ON CA.category_id=CO.category_id ORDER BY CO.content_id ASC;`

<img width="930" height="371" alt="image" src="https://github.com/user-attachments/assets/301797ea-f38f-4a33-b5ee-ecc7417fcecf" />

5. Query 2: Top Performers - Sorted by Popularity

`SELECT * FROM CONTENT C ORDER BY C.views_in_millions DESC;`
<img width="1166" height="347" alt="image" src="https://github.com/user-attachments/assets/5f72c3b4-1d89-43e4-9952-8ae43f75021c" />

6. Query 3: Category Analytics - Average Rating per Category

`SELECT CA.category_name, AVG(CO.rating) as average_rating FROM CATEGORY CA JOIN CONTENT CO ON CA.category_id=CO.category_id GROUP BY CA.category_name;`
<img width="1891" height="269" alt="image" src="https://github.com/user-attachments/assets/f8b38235-cb81-4602-aca1-7cdb6eff770e" />

7. Query 4: High-Rated Content with Filters

`SELECT CO.title, CO.rating, CO.views_in_millions, CA.category_name FROM CATEGORY CA JOIN CONTENT CO ON CA.category_id=CO.category_id WHERE CO.rating>8.5 AND CO.views_in_millions>100;`
<img width="1904" height="267" alt="image" src="https://github.com/user-attachments/assets/bb1cf1f8-120c-4f35-8d0f-eb2d66e57d1e" />

8. Query 5: Index Demonstration

`EXPLAIN ANALYZE` on Query 1
<img width="1889" height="597" alt="image" src="https://github.com/user-attachments/assets/8534631e-5f28-42eb-85a5-2f093514bf9d" />

`CREATE INDEX idx_category_id ON content(category_id);`
<img width="930" height="80" alt="image" src="https://github.com/user-attachments/assets/8b56ceed-dde5-4786-b46f-0fd0f14545ab" />

`EXPLAIN ANALYZE` on Query 1 (after creation of index on `category_id`)
<img width="1870" height="589" alt="image" src="https://github.com/user-attachments/assets/ccd8cb22-818d-432f-90c8-ffc989649ef6" />

### Composite Index on category_id, views_in_millions

Consider the query:
`SELECT title, views_in_millions FROM content WHERE category_id = 2 ORDER BY views_in_millions DESC LIMIT 5;`
This is one of the possible common queries in a streaming app wherein wew intend to find a particular category and sort the records associated with that id by the popularity using views_in_millions.

`EXPLAIN ANALYZE SELECT title, views_in_millions FROM content WHERE category_id = 2 ORDER BY views_in_millions DESC LIMIT 5;`
<img width="1899" height="424" alt="image" src="https://github.com/user-attachments/assets/8ba53b1d-7572-47ac-ba89-15913c42747d" />

`CREATE INDEX idx_cat_views ON content(category_id, view_count DESC);`
<img width="1897" height="80" alt="image" src="https://github.com/user-attachments/assets/d336a74a-de9d-4bd2-b3f5-80c277b1259a" />

`EXPLAIN ANALYZE SELECT title, views_in_millions FROM content WHERE category_id = 2 ORDER BY views_in_millions DESC LIMIT 5;`
<img width="1891" height="357" alt="image" src="https://github.com/user-attachments/assets/2e9fe0a0-0f7b-4985-9e7f-32ad95913c0e" />

9. Materialized View for Dashboards in Streamflix
   A materialized view stores the results of a query as a physical table. Unlike a normal view which runs the query each time, a materialized view returns precomputed results which makes it fast. We have to refresh it to update the stored results when source data changes.

`CREATE TABLE category_avg_rating (category_id INT PRIMARY KEY, avg_rating DECIMAL(4,2), num_contents BIGINT, last_update TIMESTAMP);`
<img width="1897" height="54" alt="image" src="https://github.com/user-attachments/assets/3ce0f2c4-67d4-47fa-a883-05e7358ac478" />

We can then write an automated refresh to update the details periosically.
SET GLOBAL event_scheduler = ON;

CREATE EVENT refresh_category_avg_rating
ON SCHEDULE EVERY 5 MINUTE DO
BEGIN
TRUNCATE TABLE category_avg_rating;
INSERT INTO category_avg_rating(category_id, avg_rating, num_contents, last_update)
SELECT category_id, AVG(rating), COUNT(\*), MAX(updated_at)
FROM content
GROUP BY category_id;
END;

Q: Why did the index improve performance?
Creation of an index `idx_category_id` on `category_id` averts a full table scan. Instead, indexing helps to locate relevant records directly without going through the entire table. This speeds up the join by accelerating the lookup of content rows for each category, making each nested probe faster.

## Concept Check - "The 3 Why's"

### Why #1: Why do we use Foreign Keys?

The use of foreign keys help us enforce referential integrity that is , they make sure that every record (for example in content) actually points to a valid, existing record (as in category table).

So, if we tried to insert a content record with category_id = 999 when no such category exists, MySQL would reject the insert with a foreign key error.

### Why #2: Why is ACID important for this database?

ACID is important because it guarantees that all the simultaneous updates that happen to the data happen correctly, safely and predictably even with heavy load.

Without ACID, it would cause:

1. Lost Update Problem - Lack of Isolation: Two users could update the same old view count, increment it separately and overwrite the other's result.
   Old count=10.
   User 1 reads 10, writes 11
   User 2 reads 10, writes 11
   One Update is lost in the process.
2. Corrupted Writes - Lack of Atomicity: Let's say we are updating a view count we will first read the old count, then calculate the new count and then write it, and if the system crashes in the middle then the system might be left in corrupted state.
3. Inconsistency of Data - Lack of Consistency: If a transaction is trying to set the view_in_millions count to a negative number, without durability such updates can violate the rules of the database. The consistency property ensures that any transaction violating the database's rules like `CHECK` constraints is rolled back, keeping the data valid at all times.
4. Damage to Data if system crashes - Lack of Durability: If the server crashes right after writing an updated view count, without durability this update can disappear.

### Why #3: Why would we create an index on category_id?

Without an index on category_id, we need to scan every row to find a match which leads to huge load times for the streamflix app which runs hundreds of queries filtering by category, each query requiring a scan through ALL records.

With an index on category_id, the database used a sorted lookup like a book index to perform the search which helps it to find the matching records directly without having to scan through all records thus leading to faster page load of the streamflix app.

### Live Coding on 10-12-2025

Q:
Create a new table called user_watchlist with columns:

user_id (integer)
content_id (integer, foreign key to content)
added_date (date)

Insert 3 rows linking users to content. Show your table structure and data.

Write a query that shows: user_id, content title, and category name for all watchlist items

You need to speed up queries that search for content by release_year.

Create an index.
Show me the CREATE INDEX command you used.
Run EXPLAIN ANALYZE on a query filtering by release_year.

Solution:
CREATE TABLE user_watchlist(user_id INTEGER NOT NULL, content_id INTEGER NOT NULL, added_date DATE, FOREIGN KEY (content_id) REFERENCES content(content_id));

INSERT INTO user_watchlist(user_id, content_id, added_date) VALUES (101, 1, '2025-01-02'), (102, 3, '2025-01-05'), (101, 5, '2025-01-10');

DESC user_watchlist;
SELECT \* FROM user_watchlist;

SELECT UW.user_id, C.title AS content_title, CA.category_name FROM user_watchlist UW JOIN CONTENT C ON UW.content_id=C.content_id JOIN CATEGORY CA ON C.category_id=CA.category_id ORDER BY UW.user_id;

CREATE INDEX idx_year ON content(release_year);

EXPLAIN ANALYZE SELECT content_id, title, rating FROM CONTENT WHERE release_year=2024;

## Assessment on 5-01-2026:
SELECT CO.title, CA.category_name FROM CONTENT CO INNER JOIN CATEGORY CA ON CA.category_id=CO.category_id WHERE category_name='Documentaries' AND CO.rating>8.0 GROUP BY CO.title;

SELECT * FROM (SELECT title, (rating + views_in_millions) AS success_score FROM CONTENT CO) co WHERE co.success_score>100;
