#!/bin/bash

user=$1
password=$2
port=$3

mongo <<EOF
use admin
rs.initiate({
  "_id": "rsmongo1",
  "members": [
    {"_id": 0, "host": "localhost:$port"}
  ]
})
db.createUser({
  user: "$user",
  pwd: "$password",
  roles: [
    { role: "root", db: "admin" }
  ]
})
EOF
