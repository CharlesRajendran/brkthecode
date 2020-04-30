// const data = [ [ 7, 1 ] , [ 5 , 5 ] , [ 8 , 2 ] , [ 1 , 2 ] , [ 0 , 0 ] ];

/*
   Technology: Node.js (ES6 and above version syntax is also used so latest version of node required to run)
   Approach :  Start from the end.
               Ignore invalid points
               Remove some reachable points based on some other point's battery life               
*/
const fs = require('fs');

function readFile() {
   let read;
   try {
      read = fs.readFileSync('IFSLabs_BrkTheCode_DataSet.txt', 'utf8');
   } catch(ex) {
      console.log(ex);
   }
   return JSON.parse(read);
}

function writeFile(answer) {
   try {
      fs.writeFileSync("answer.txt", answer);
   } catch(ex) {
      console.log(ex);
   }
}


function findBestStations(data) {
   let temDist = 0;
   let points = []; // to have the selected points

   for(let i=data.length -2; i >= 0; i--) { // loop start from n-1 th point.
      let battery = data[i][0];
      let distance = data[i][1];

      temDist += distance; // temDist : Have the distance between the current point and the end.

      if(battery < distance) { // If the point distant is more than battery ignore the point
        continue;
      } else if (battery >= temDist) { // If the point's battery is enough to reach the end, ignore all the points that come after the current point.
          points = [];
          let obj = {id: i, dist: temDist}; // an object which has point id and distance of the point from end point.
          points = [obj];
      } else { // General case where none of the above condition met.
          let reachablePoints = []; 
         // above array is, to have a list of values to hold the array of points that can be reached with the battery of the current point
         // for example [...(20, 5), (3, 2), (7, 5), (12, 9)...]
         // In the above case we can use 20 batteries to reach upto 4rth point, so we can ignore 2nd and 3rd point.
    
          points.forEach((point) => {
            let diffToPoint = temDist - point.dist; // difference between current point and the other reachable points
            if (battery >= diffToPoint) { // condition to check whether the point is reachable
               reachablePoints = [...reachablePoints, point.id];
            } 
          });
          
          let nextPoint = reachablePoints[reachablePoints.length - 1]; // nextPoint have last point we can reach from the current point with it's battery
    
          points = points.filter((point) => { // to remove points in the reachableArray from points array
             if (point.id < nextPoint) {
                return false;
             }
             return true;
          });
    
          points = [{id: i, dist: temDist}, ...points]; // inserting point with some information to points array
      }
   }

   let finalPoints = points.map((point) => { // converting the object({id, dist}) of array into array of points
      return point.id
   });

   finalPoints = [...finalPoints, data.length -1]; // adding the last point
   let [first, ...answer] = finalPoints; // removing the first point

   return JSON.stringify({"answer": answer});
}


console.time('js-counter');
const data = readFile().data;
const answerJson = findBestStations(data);
writeFile(answerJson);
console.timeEnd('js-counter');
