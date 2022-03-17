# ECE-458 LeGoons

Senior design course project!
 
## Getting Started

### Deployment

Using github actions, a developmental server is automatically deployed upon pushes to the branch `dev`, and a production server is automatically deployed upon pushes to `main`.

The one thing to watch out for: if you edit a docker-compose file, you have to ssh into every host, `git fetch origin && git pull`

The hosts for these servers are as listed:

#### PRODUCTION

`https://hypothetical-transportation.colab.duke.edu`

#### DEV

`https://ht-dev.colab.duke.edu`

#### TEST ENV (must be deployed manually)

`https://ht-test.colab.duke.edu:8000`

### Creating a new server

#### Reserve a VCM/obtain a host

```
echo '...ssh into your host...'
echo '...get the repo on there in some way (aka make a ssh key and clone repo)...'
cd scripts
echo '...validate that the domains are correct in install_vcm for the creation of certs'
cat install_vcm.sh
./install_vcm.sh
```

### Running the frontend

Compiles frontend content to be served. Package manager will hang and `Ctrl-C` can be used.

```
npm install
npm run dev
```

To compile for production, run:

```
npm run build
```

### Running the Stack

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

_Seeding the Database with random data:_

```
python3 manage.py flush
python3 manage.py seeddb /*Optional Flags*/
```

_After flushing, to load in json data_

```
python3 manage.py loaddata backend/fixtures/hypodata.json
python3 manage.py loaddata backend/fixtures/newgroups.json /* new group fixtures */

```

_To configure email credentials:_

```
export AUTHEMAIL_EMAIL_HOST_USER=<GMAIL_ACCOUNT>
export AUTHEMAIL_EMAIL_HOST_PASSWORD=<PASSWORD>
```

Optional Flags:

--numusers [param] (default=100)

--numroutes [param] (default=400)

--numschools [param] (default=400)

--numstudents [param] (default=1000)

#### Starting the Server

locally:

```
python3 manage.py runserver
```

within the host:

```
sudo docker-compose -f docker-compose.<ENV>.yml down --volumes --remove-orphans
sudo docker-compose -f docker-compose.<ENV>.yml up --build
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
