# ECE-458

Senior design course project!

## Getting Started

### Running the frontend

Compiles frontend content to be served. Package manager will hang and `Ctrl-C` can be used.

```
npm install
npm run dev
```

### Running the Backend Stack
#### First Time Installation
```
./scripts/start_django.sh
python3 manage.py makemigrations
python3 manage.py migrate
```
#### Seeding the Database
_Create an admin:_
```
python3 manage.py initadmin
```
```
python3 manage.py flush
python3 manage.py loaddata backend/fixtures/data.json
```
#### Starting the Server
```
python3 manage.py runserver
```

### Testing

## Endpoints
### Authentication Endpoints
```
curl -X GET --header "Authorization: Token <TOKEN>" http://localhost:8000/api/auth/user
```

## Troubleshooting

- `npm install -g nodemon` may be necessary (installing Nodemon globally) to ensure that the command to start the server
  works. If this doesn't work, the `node` can be used instead for starting the server.
- Make sure to run `npm install` in both directories.
- Make sure to create a `config.env` file for future use inside the `server` folder. We'll probably add credentials into
  the file.
- `npx prettier --write .` will format everything in a folder for you, but VSCode also has a great extension to do this
  automatically.
