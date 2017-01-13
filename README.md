# SumoSurvey

## Summary

Simple, self-hostable survey platform
######Check out the ~~DEMO~~
* Login credentials:
 * username: admin
 * password: ilovetacos


#### Requirments

* Frameworks required:
  *  Node.JS (v0.10.x)
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
* Admin password is hashed.
* Passport will be used to authenticate Admin.
* Cookies are used to display randomly unique question to user.
* Cookies will store logged in admin info, using session stored in db.

## Getting Started

#### Dependencies

* [NodeJS](https://nodejs.org/download/) (v0.10.x)
* npm

#### Setup

* `git clone https://github.com/mattjdev/sumosurvey.git`
* `cd sumosurvey`
* `npm install`
* Setup MySQL:
  * `mysql -u root -p`
  * `CREATE DATABASE sumosurvey_dev;`
  * `CREATE USER 'sumosurvey'@'localhost' IDENTIFIED BY 'sumosurveypass';`
  * `GRANT ALL PRIVILEGES ON sumosurvey_dev . * TO 'sumosurvey'@'localhost';`
* Change MySQL username and password in development (default) database configuration [config/config.json](config/config.json)
* `npm start`
* Optional: change admin password in [seed.json](seed.json)
* Open browser window to http://localhost:3000/

## Application

#### Url Routes:
* / - displays random survey question.
* /login - log in to admin interface.
* **Admin Authentication Required for the following:**
  * /admin/list - lists surveys with results.
  * /admin/form - form to create new survey.
  * /admin/form/:survey_id - form to edit existing survey.

#### API Routes

* Admin:
  * POST /api/admin/login {username, password}
  * POST /api/admin/logout
* Surveys:
  * GET /api/surveys/random
  * **Admin Authentication Required for the following:**
    * GET /api/surveys
    * POST /api/surveys {question_text, Options[{text}]}
    * GET /api/surveys/count
    * GET /api/surveys/:survey_id
    * PUT /api/surveys/:survey_id {question_text, Options[{text}]}
    * POST /api/surveys/:survey_id {question_text, Options[{text}]}
    * DELETE /api/surveys/:survey_id
* Options:
  * POST /api/options/:option_id/answer
  * **Admin Authentication Required for the following:**
    * DELETE /api/options/:option_id

## License

Copyright (c) 2015 Matthew Jacobs.
See [LICENSE](LICENSE) for details.
