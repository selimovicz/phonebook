use books
db.createCollection('book')

db.createUser(
   {
     user: "zeid",
     pwd: "test123",
     roles:
       [
         { role: "readWrite", db: "books" }       ]
   }
)