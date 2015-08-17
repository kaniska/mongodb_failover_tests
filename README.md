mongodb-dr-test
===============

##### Deployment Architecture Reference :

http://docs.mongodb.org/manual/core/replica-set-architectures/ , http://docs.mongodb.org/manual/tutorial/deploy-geographically-distributed-replica-set/ , http://docs.mongodb.org/manual/tutorial/add-replica-set-arbiter/

Assume P1 is primary, S1 and S2 secondary nodes.
##### Happy Path Scenario
> start the test server by pointing to a Dev / PreProd MongoDB Replicaset
> MONGODB_REPLICASET=P1:27017, S1:27017, S2:27017 node server.js

> Now to test the setup by simply inserting and querying documents  :
curl -XPOST 'http://localhost:3004/rest/api/' -d '{itemName:"iPhone", price:"200”}'
curl -XGET 'http://localhost:3004/rest/api/count/'

##### DR Scenario - 1
> Incidence - S1 / S2 goes down.
Failover Test :
> MongoDB should continue to work without interruption.
> Writes / Reads should succeed 
curl -XPOST 'http://localhost:3004/rest/api/' -d '{itemName:"iPhone", price:"200”}'
curl -XGET 'http://localhost:3004/rest/api/count/'
Recovery Test :
> S1 / S2 is up again
> MongoDB should perform without issues.
> Writes / Reads should succeed 
curl -XPOST 'http://localhost:3004/rest/api/' -d '{itemName:"iPhone", price:"200”}'
curl -XGET 'http://localhost:3004/rest/api/count/'
##### DR Scenario - 2
> Incidence - Primary P1 goes down 
Failover Test :
> MongoDB should perform without issues.
> One of the secondary in DAL should become Primary
> Writes / Reads should succeed 
curl -XPOST 'http://localhost:3004/rest/api/' -d '{itemName:"iPhone", price:"200”}'
curl -XGET 'http://localhost:3004/rest/api/count/'
Recovery Test :
> Old Primary is up again.
> Writes / Reads should succeed 
curl -XPOST 'http://localhost:3004/rest/api/' -d '{itemName:"iPhone", price:"200”}'
curl -XGET 'http://localhost:3004/rest/api/count/'

##### DR Scenario - 3
> Incidence - Both S1 and S2 go down.
Failover Test :
> MongoDB P1 will become read-only.
Take backup of PRIMARY db
mongodump -oplog --out /app/backup/mongodump-mm-dd-yyyy
tar -zcvf mongodump-mm-dd-yyyy.tar.gz /app/bkup/mongodump-mm-dd-yyyy
scp mongodump-mm-dd-yyyy.tar.gz p1_:~/temp/
Force secondary to become primary
start mongo shell
mongo <surviving-member-hostname>
cfg = rs.conf()
Find and set  the member id of the <secondary-to-be-promoted-as-primary>
for example cfg.members = [cfg.members[2]]   // here members[2] is the surviving one !
rs.reconfig(cfg,{force : true})
Now Writes / Reads should succeed 
curl -XPOST 'http://localhost:3004/rest/api/' -d '{itemName:"iPhone", price:"200”}'
curl -XGET 'http://localhost:3004/rest/api/count/'
Recovery Test :
both S1 and S2 are up.
Add the members to replicaset
login to the box S1 and S2 and start mongod in each box using the start script
start mongo shell of primary mongod
mongo <primary-hostname>
rs.add(<secondary-1-hostname>)
rs.add(<secondary-2-hostname>)
Check  Replicaset status :   rs.conf() and rs.status()
