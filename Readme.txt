This is a simple Phonebook app, made by combining AngularJS with NodeJS.

## Instalation
To run it, you have to do few simple steps:

```
1. npm install
2. bower install
3. grunt (build up all required files and run server on 8080 port)
4. go to: http://localhost:8080/#/

```

## Simple migration
To test authentication and to be able to access application in general, please hit the following command, 
which will create user with credentials which you can use to login (note that you need to have application up and running).

```
curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"email": "test01@test.com", "password": "test"}' http://localhost:8080/api/setup
```


