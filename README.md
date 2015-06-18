# SumoSurvey

## Summary



#### Requirments

* Frameworks required:
 *  Node.JS
 *  Express
 *  SequelizeJS
 *  MySQL Database
 *  NPM for easy install
* Admin login for the following:
 * Enter new survey questions
 * Display results of survey questions
* Display a random, non-repeating question to a user
* Record their answer
* Mobile friendly

#### Assumptions

* There will only be one admin.
* Users will not have to log in.
* Users will no be able to see the results of any surveys.
* You will only be able to change the admin password from server configuration.
* Cookies will be used to determine what questions a user has answered.

#### Decisions

* AngularJS will be used for the frontend development.
* I will use 3 mysql tables: 
 * Admin - to hold username and password for login
 * Survey - contains the question and a has-many relationship with Options
 * Options - which will hold the option text as well as the amount of 'votes' it has received
* Admin password is cleartext.
* Passport will be used to authenticate Admin.

## Getting Started

#### Dependencies

* [NodeJS](https://nodejs.org/download/)
* npm

#### Setup

* `git clone https://github.com/swengmatt/sumosurvey.git`
* `cd sumosurvey`
* `npm install`
* Setup MySQL:
 * `mysql -u root -p`
 * `CREATE DATABASE sumosurvey_dev;`
 * `CREATE USER 'sumosurvey'@'localhost' IDENTIFIED BY 'sumosurveypass';`
 * `GRANT ALL PRIVILEGES ON sumosurvey_dev . * TO 'sumosurvey'@'localhost';`
* Change MySQL username and password in [config/config.json](config/config.json)
* `node bin/www`
* Open browser window to http://localhost:3000/
