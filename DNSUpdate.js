const freednsApi = require('./freedns-api');
//counts # of updates
var updates = 0;
var cycles = 0;
//determines the length of time between updates in minutes
const updatePeriod = 1;
var updated;
//this current public IPv4
(async () => {
    /**
     *  Wrap everything inside a try-catch block.
     *  if there is invalid configuration or network problems an error will be thrown
     */

   do { 
   	updated=false;
    try {
        
        // Get a list of all account dns records
        var entries = await freednsApi.getdyndns({
            username: 'donkeypunter',
            password: ''
        });
    } catch (error) {
    	console.log(status);
    	console.log(error);

    }
 
//console.log('this program updates one entry per loop, do not ask me why. Ignore updates counter. ');

		
for (var i=0;i<6;i++){
    
        try{
        var status = await freednsApi.update({
          updateUrl : entries[i].updateUrl
        });
        updated=true;
    }catch (error){

    }
 }
} while (await timer(updated));
    
})();
async function timer(updated) {

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Updating..."), updatePeriod*60000)  });
    updates = Update(updates,updated);
  setTimeout(() => {process.stdout.write('\033c');},updatePeriod*60000);
  return promise; // wait until the promise resolves (*)
} 
function Update(updates,updated){
cycles++;
if (updated){
updates++;
console.log('Updated');
} else{
    console.log('Not Updated');
}

if (updates==1){
    console.log("\x1b[31m%s\x1b[0m",updates + ' Update');
} else {
    console.log("\x1b[31m%s\x1b[0m",updates + ' Updates');
}
if (cycles==1){
    console.log("\x1b[31m%s\x1b[0m",cycles + ' Cycle');
} else {
    console.log("\x1b[31m%s\x1b[0m",cycles + ' Cycles');
}
return updates;
}


