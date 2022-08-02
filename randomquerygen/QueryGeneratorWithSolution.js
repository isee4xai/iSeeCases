const fs = require('fs');
//Read the Taxonomy file
var taxonomyData;
fs.readFile('Taxonomy.json', 'utf8', (err, data) => {
  // if (err) console.error(err);
  taxonomyData = JSON.parse(data);
  // console.log(taxonomyData);
});

// Generating a random query from SeedCase.json file
function getRandQuery(){
  fs.readFile('SeedCase.json', 'utf8', (err, data) => {
      if (err) console.error(err);
      var jsonData = JSON.parse(data);
      const keys = Object.keys(jsonData);
      const randIndex = Math.floor(Math.random() * keys.length);
      const randKey = keys[randIndex];
      const randVal = jsonData[randKey];
      // Convert pretty-print JSON object (random) to string - serialize JSON object (properly formatted)
      const caseData = JSON.stringify(randVal, null, 4);
      // Write JSON string to a new file
      try {
        fs.writeFileSync('RandomQuery.json', caseData);
        console.log("Random query generated.");
      } catch (error) {
          console.error(err);
      }
      callback(randVal); // call the callback function and pass the random value as the parameter to it
    });
  }

 /* Generates the randomQuery*/
function callback (randomQueGen) {
  console.log(randomQueGen);
   //Assign empty value to the hasExplainer instance
  var explainer;
  if(explainer = randomQueGen.hasDescription.hasExplainer){
    explainer.instance = "";
    explainer.utilises.instance = "";
    explainer.utilises.hasOutputType.instance = "";
  }
  else{
    console.log('Exit');
  }

 //Create a list of instance names
  var caseName =["Apple", "Netflix", "Microsoft", "Amazon", "Samsung", "Nokia", "Meta", "Adidas", "Google", "Intel"];
  //Get a random instance
  const randIndexCaseName = Math.floor(Math.random() * caseName.length);
  const randomCaseName = caseName[randIndexCaseName];
  console.log("randomCaseName: "+randomCaseName); 

  //  Get the seedCaseName from randomQuery
  var instanceName = randomQueGen.instance;
  if (instanceName.includes("ExplanationExperience")) {
    const myArray = instanceName.split("ExplanationExperience");
    var extractedInstanceName = myArray[0];
    console.log("extractedInstanceName: " + extractedInstanceName);
  }
  randomCN(randomQueGen, randomCaseName, extractedInstanceName);
  randomCaseInsGen(randomQueGen, randomCaseName, extractedInstanceName);
  const randomQueryData = JSON.stringify(randomQueGen, null, 4);
  // Generates the randomQuery with a new usecase name
  fs.writeFileSync('RandomQueryNameChange.json', randomQueryData);
  console.log("Case name changed.");

  //Modify the property values - random class, random instance, replace instance name
  randomClassGen(randomQueGen,randomCaseName);
  randomCaseInsGen(randomQueGen, randomCaseName, extractedInstanceName);
  const randomQueryModification = JSON.stringify(randomQueGen, null, 4);
  // Generates the randomQuery with a new usecase name and class modifications
  fs.writeFileSync('RandomQueryModification.json', randomQueryModification);
  console.log("Random class modification.");
  // console.log(randomQueryModification);
}

/* Replace the seedCaseName with randomCaseName - randomCaseQuery.hasDescription.hasAIModel.solves.instance,randomCaseQuery.hasDescription.hasAIModel.utilises.instance, 
randomCaseQuery.hasDescription.hasUser.hasIntent.instance*/
function randomCN(randomCaseQuery,randomCN,extractedName) {
  //Get random aiTask - randomQuery.hasDescription.hasAIModel -> solves, utilises, trainedOn.hasDataType; randomQuery.hasDescription.hasUser -> hasIntent, hasResources, hasResources.canHandle, possess.levelOfKnowledge
  var aiTaskS=randomCaseQuery.hasDescription.hasAIModel.solves.instance, aiTaskU=randomCaseQuery.hasDescription.hasAIModel.utilises.instance, 
  aiTaskI=randomCaseQuery.hasDescription.hasUser.hasIntent.instance;
  var instanceArray = [aiTaskS,aiTaskU,aiTaskI];
  //Modify the instance names 
  for(let i in instanceArray){
    var newInstanceName=instanceArray[i].replace(extractedName, randomCN);
    if(instanceArray[i]==aiTaskS){
      randomCaseQuery.hasDescription.hasAIModel.solves.instance=newInstanceName;
    }else if(instanceArray[i]==aiTaskU){
      randomCaseQuery.hasDescription.hasAIModel.utilises.instance=newInstanceName;
    }else if(instanceArray[i]==aiTaskI){
      randomCaseQuery.hasDescription.hasUser.hasIntent.instance=newInstanceName; //Usually no change
    }else {
      console.log("Exit");
    }
    console.log("newinstanceArray "+ i + ": " + newInstanceName);
  } 
}

/* Replace the seedCaseName with randomCaseName - randomQuery.instance, randomQuery.hasDescription.hasAIModel.instance, 
   randomQuery.hasDescription.hasAIModel.trainedOn.instance, randomQuery.hasDescription.hasUser.instance, randomQuery.hasDescription.hasUser.possess.instance*/
function randomCaseInsGen(randomQuery,randomCaseName,extractedCaseInsName){
  var instanceName = randomQuery.instance, aiModelIns=randomQuery.hasDescription.hasAIModel.instance, trainedOnIns=randomQuery.hasDescription.hasAIModel.trainedOn.instance, 
  hasUserIns=randomQuery.hasDescription.hasUser.instance, possessIns=randomQuery.hasDescription.hasUser.possess.instance;
  var instanceArray = [instanceName,aiModelIns,trainedOnIns,hasUserIns,possessIns];
   // InstanceName: GradCAMModelFailDetectionExplanationExperience, extractedInstanceName: GradCAMModelFailDetection, randomCaseName: Netflix
   for(let i in instanceArray){
     var newInstanceName=instanceArray[i].replace(extractedCaseInsName, randomCaseName);
     if(instanceArray[i]==instanceName){
      randomQuery.instance=newInstanceName;
     }else if(instanceArray[i]==aiModelIns){
      randomQuery.hasDescription.hasAIModel.instance=newInstanceName;
     }else if(instanceArray[i]==trainedOnIns){
      randomQuery.hasDescription.hasAIModel.trainedOn.instance=newInstanceName;
     }else if(instanceArray[i]==hasUserIns){
        newInstanceName= randomCaseName.concat("User");
        randomQuery.hasDescription.hasUser.instance=newInstanceName;
     }else if(instanceArray[i]==possessIns){
      randomQuery.hasDescription.hasUser.possess.instance=newInstanceName;
     }else {
       console.log("Exit");
     }
     console.log("newinstanceArray "+ i + ": " + newInstanceName);
   }
}

/*Modify the property values - random class, random instance, replace instance name*/
function randomClassGen(randomQuery,randomCaseName){
 //Get random aiTask - randomQuery.hasDescription.hasAIModel -> solves, utilises, trainedOn.hasDataType; randomQuery.hasDescription.hasUser -> hasIntent, hasResources, hasResources.canHandle, possess.levelOfKnowledge
 var aiTaskModel = randomQuery.hasDescription.hasAIModel, aiTaskUser = randomQuery.hasDescription.hasUser;
 var aiTaskS = taxonomyData.solves.classes, aiTaskU = taxonomyData.utilises.classes, aiTaskI = taxonomyData.hasIntent.classes;
 var aiTaskArray = [aiTaskS,aiTaskU,aiTaskI];
 // var aiTaskD = taxonomyData.hasDataType.instance, aiTaskR = taxonomyData.hasResources.instance, aiTaskC = taxonomyData.canHandle.instance, aiTaskL = taxonomyData.levelOfKnowledge.instance;
 // var aiTaskArrayInst = [aiTaskD,aiTaskR,aiTaskC,aiTaskL]; 
 /* Modify the property values - random class, random instance, concat instance name with random class*/
 for(let i in aiTaskArray){
   console.log("aiTaskArray "+ i + ": "+ aiTaskArray[i])
   if(aiTaskArray[i]==aiTaskS){
     const randIndex = Math.floor(Math.random() * aiTaskS.length);
     const randaiTask = aiTaskS[randIndex];
     aiTaskModel.solves.classes = [randaiTask];
     console.log("randaiTask "+ i + ": "+ randaiTask); 
     //Concantenate randomCaseName with randaiTask (class)
     aiTaskModel.solves.instance = randomCaseName.concat(" ", randaiTask);
     console.log("New Instance "+ i + ": "+ randomCaseName.concat(" ", randaiTask));
   }
   else if(aiTaskArray[i]==aiTaskU){
     const randIndex = Math.floor(Math.random() * aiTaskU.length);
     const randaiTask = aiTaskU[randIndex];
     aiTaskModel.utilises.classes = [randaiTask];
     console.log("randaiTask "+ i + ": "+ randaiTask);
     //Concantenate randomCaseName with randaiTask (class)
     aiTaskModel.utilises.instance = randomCaseName.concat(" ", randaiTask);
     console.log("New Instance "+ i + ": "+ randomCaseName.concat(" ", randaiTask)); 
   } 
   else if(aiTaskArray[i]==aiTaskI){
     const randIndex = Math.floor(Math.random() * aiTaskI.length);
     const randaiTask = aiTaskI[randIndex];
     aiTaskUser.hasIntent.classes = [randaiTask];
     console.log("randaiTask "+ i + ": "+ randaiTask);
     //Concantenate randomCaseName with randaiTask (class)
     aiTaskUser.hasIntent.instance = randomCaseName.concat(" ", randaiTask);
     console.log("New Instance "+ i + ": "+ randomCaseName.concat(" ", randaiTask)); 
   }
   else {
     console.log("Exit");
   }
 }
}

//pass the callback function as an argument to the getRandQuery()
getRandQuery(callback);
