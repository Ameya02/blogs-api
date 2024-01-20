
# Blogs-API using Node.js, Express and MySQL using Seqeulize

# Overview
Blogs-api is backend project using node.js and express.js for mangament a blog system for user mangament, post and comments mangament





## Features

- User Authentication: Only Authenticate users can comment and post
- Jsonwebtoken: JWT is used for token generation
- Secure Password Hashing: Employ bcrypt for robust password hashing to enhance security.
- Access Control: Only Authroized users can makes changes to their account post and comments



## Tech Stack


**Server:** Node, Express, MySQL, Sequelize, Jsonwebtoken, Bcrypt


## Installation


## Installation

Here are the steps to install the project 

Step 1: Clone the github link
```bash 
https://github.com/Ameya02/blogs-api

````
Step 2: Install the dependencied
```bash
cd blogs-api
npm install 

```
Step 3: Make Sure you have MySQL in the Syste,
```bash
create database blogs-db;
```

Step 4: run the project using the following commands
```bash
npm run server
```
Project will run at port 3001

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_USER`: name of the user of the mysql database eg: root

`DB_NAME`: name of the database eg: blogsDB

`DB_PW`: password of the user: eg root

`JWT_SECRET`: secret key of json web token eg json_secret


## Author

- [@AmeyaBavkar](https://www.github.com/Ameya02)


## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug fixes, please open an issue or submit a pull request. We greatly appreciate any work contributed, no matter how big or small it is!. Make sure to follow the project's code of conduct.

Issues & Pull Requests
When you are ready to start work on an issue:

- Let us know by leaving a comment on the issue (or you can also raise a new issue if you want to work on something completely new in the project)
- Once you are assigned the issue (or once you have claimed the issue) only then proceed to make the Pull Request. This will help avoid multiple PRs pertaining to the same issue.
- Go through the CONTRIBUTING.md file, where all the guidelines have been mentioned that will guide you to make your contribution.
- Do check out the project issue tracker section.


## License

[MIT](https://choosealicense.com/licenses/mit/)

