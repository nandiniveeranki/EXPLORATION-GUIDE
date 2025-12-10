// check connection and list databases
use("admin");
db.runCommand({ listDatabases: 1 });

