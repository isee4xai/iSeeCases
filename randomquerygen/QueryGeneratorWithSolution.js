const fs = require('fs');
// var fs1 = require('fs-extra'); 
//Create a list of instance names
const caseNames = ["Adidas","Alphabet","Amazon","Apple","Cisco","Foxconn","Google","Huawei","Hitachi","IBM","Intel","Lenovo",
"Netflix","Nokia","Meta","Microsoft","Panasonic","Qualcomm","Samsung","Sony"];

//cannot be larger than number of features to modify (9 at the moment)
const noOfVersions = 9; 

var taxonomyData, aiTasks, intents, aiMethods;
fs.readFile('Taxonomy.json', 'utf8', (err, data) => {
  if (err) console.error(err);
  taxonomyData = JSON.parse(data);
  //pre-load all taxonomies for future, 
  aiTasks = taxonomyData.solves.classes;
  aiMethods = taxonomyData.utilises.classes;
  intents = taxonomyData.hasIntent.classes;
  dataTypes = taxonomyData.hasDataType.instance;
  technicalFacilities = taxonomyData.hasResources.instance;
  explanationModalities = taxonomyData.canHandle.instance;
  knowledgeLevels = taxonomyData.levelOfKnowledge.instance;
  portabilities = taxonomyData.hasPortability.instance;
  scopes = taxonomyData.hasExplanationScope.instance;
  targets = taxonomyData.targetType.instance;
  presentations = taxonomyData.hasPresentation.instance;
  concurrents = taxonomyData.hasConcurrentness.instance;
});

function getRandomValue(previous, collection){
  var randVal;
  console.log('previous: '+previous);
  if (collection.length == 1)
    return previous;
  do{
    randVal = collection[ Math.floor(Math.random() * collection.length)];
    console.log('now: '+randVal);
  } while (randVal===previous);
  return randVal;
}
/*dictionary of all modifications. 
in future we can add functions here if new case features are introduced.*/
var allModifications = {
  modifyAITask: function(randomQuery, randomCaseName) {
    var randTask = getRandomValue(randomQuery.hasDescription.hasAIModel.solves.classes[0], aiTasks);
    randomQuery.hasDescription.hasAIModel.solves.classes = [randTask];
    randomQuery.hasDescription.hasAIModel.solves.instance = randomCaseName.concat(" ", randTask);
    console.log("modifyAITask: "+randTask);
  },
  modifyIntent: function(randomQuery, randomCaseName) {
    var randIntent = getRandomValue(randomQuery.hasDescription.hasUser.hasIntent.classes[0], intents);
    randomQuery.hasDescription.hasUser.hasIntent.classes = [randIntent];
    randomQuery.hasDescription.hasUser.hasIntent.instance = randomCaseName.concat(" ", randIntent);
    console.log("modifyIntent: "+randIntent);
  },
  modifyAIMethod: function(randomQuery, randomCaseName) {
    var randMethod = getRandomValue(randomQuery.hasDescription.hasAIModel.utilises.classes[0], aiMethods);
    randomQuery.hasDescription.hasAIModel.utilises.classes = [randMethod];
    randomQuery.hasDescription.hasAIModel.utilises.instance = randomCaseName.concat(" ", randMethod);
    console.log("modifyAIMethod: "+randMethod);
  },
  modifyDataType: function(randomQuery, randomCaseName) {
    var randDataType =  getRandomValue(randomQuery.hasDescription.hasAIModel.trainedOn.hasDataType.instance, dataTypes);
    randomQuery.hasDescription.hasAIModel.trainedOn.hasDataType.instance = randDataType;
    console.log("modifyDataType: "+randDataType);
  },
  modifyResources: function(randomQuery, randomCaseName) {
    var randTechFacility = getRandomValue(randomQuery.hasDescription.hasUser.hasResources.instance, technicalFacilities);
    randomQuery.hasDescription.hasUser.hasResources.instance = randTechFacility;
    console.log("modifyResources: "+randTechFacility);
  },    
  //canHandle is not working
  // modifyHandles: function(randomQuery, randomCaseName) {
  //   var randmodality = getRandomValue(randomQuery.hasDescription.hasUser.hasResources.canHandle.instance[0], explanationModalities);
  //   // console.log("modifyHandles before: "+randomQuery.hasDescription.hasUser.hasResources.canHandle.instance);
  //   randomQuery.hasDescription.hasUser.hasResources.canHandle.instance = randmodality;
  //   console.log("modifyHandles after: "+randmodality);
  // },
  modifyLevelOfKnowledge: function(randomQuery, randomCaseName){
    var randknowledge = getRandomValue(randomQuery.hasDescription.hasUser.possess.levelOfKnowledge.instance, knowledgeLevels);
    randomQuery.hasDescription.hasUser.possess.levelOfKnowledge.instance = randknowledge;
    console.log("modifyLevelOfKnowledge: "+randknowledge);
  },    
  modifyPortability: function(randomQuery, randomCaseName){
    var randVal = getRandomValue(randomQuery.hasDescription.hasExplainer.utilises.hasPortability.instance, portabilities);
    randomQuery.hasDescription.hasExplainer.utilises.hasPortability.instance = randVal;
    console.log("modifyPortability: "+randVal);
  },    
  //concurrentness is always post-hoc
  // modifyConcurrentness: function(randomQuery, randomCaseName){
  //   var randVal = concurrents[Math.floor(Math.random() * concurrents.length)];
  //   randomQuery.hasDescription.hasExplainer.utilises.hasConcurrentness.instance = randVal;
  //   // console.log("modifyConcurrentness: "+randVal);
  // },    
  modifyExplanationScope: function(randomQuery, randomCaseName){
    var randVal = getRandomValue(randomQuery.hasDescription.hasExplainer.utilises.hasExplanationScope.instance, scopes);
    randomQuery.hasDescription.hasExplainer.utilises.hasExplanationScope.instance = randVal;
    console.log("modifyExplanationScope: "+randVal);
  },    
  // modifyPresentation: function(randomQuery, randomCaseName){
  //   var randVal = getRandomValue(randomQuery.hasDescription.hasExplainer.utilises.hasPresentation.instance, presentations);
  //   randomQuery.hasDescription.hasExplainer.utilises.hasPresentation.instance = randVal;
  //   console.log("modifyPresentation: "+randVal);
  // },    
  modifyTargetType: function(randomQuery, randomCaseName){
    var randVal = getRandomValue(randomQuery.hasDescription.hasExplainer.utilises.targetType.instance, targets);
    randomQuery.hasDescription.hasExplainer.utilises.targetType.instance = randVal;
    console.log("modifyTargetType: "+randVal);
  }
};


function genRandomQuery() {
  fs.readFile('SeedCase.json', 'utf8', (err, data) => {
    if (err) console.error(err);
    const allCases = JSON.parse(data);
    const keys = Object.keys(allCases);
    const randKey = keys[Math.floor(Math.random() * keys.length)];
    const randCase = allCases[randKey];
    //Get a random case name
    const randomCaseName = caseNames[Math.floor(Math.random() * caseNames.length)];
    console.log("randomCaseName: " + randomCaseName);

    try {
    // Convert pretty-print JSON object (random) to string - serialize JSON object (properly formatted)
    const caseData = JSON.stringify(randCase, null, 4);
    // create new directory
    const dir = 'RandomQuery';
    // check if directory already exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log("RandomQuery Directory is created.");
    } else {
        console.log("RandomQuery Directory already exists.");
    }
    // Write random query to a new file
    fs.writeFileSync('./RandomQuery/RandomCase.json', caseData);
    console.log("Random case selected.");
    } catch (error) {
    console.error(err);
    }

    callback(randCase, randomCaseName); // call the callback function and pass the random value as the parameter to it
  });
}

function callback(randomCase, randCaseName) {
  //Assign empty value to the hasExplainer instance
  removeSolution(randomCase);
  //  Get the caseName from randomCase
  var instanceName = randomCase.instance;
  if (instanceName.includes("ExplanationExperience")) {
    var currentCaseName = instanceName.split("ExplanationExperience")[0];
    console.log("CurrentCaseName: " + currentCaseName);
  }
  //replace caseName with the randCaseName
  replaceCaseName(randomCase, randCaseName, currentCaseName);

  var oldPath = './RandomQuery/RandomCase.json'
  //Creates a folder with the new case name
  const randomCaseDir = './RandomQuery/'+randCaseName +'/';
  // check if directory already exists
  if (!fs.existsSync(randomCaseDir)) {
    fs.mkdirSync(randomCaseDir);
    console.log(randCaseName + " Directory is created.");
    //Move the RandomCase.json to the new case folder 
    var newPath = randomCaseDir+currentCaseName+'.json'
    fs.rename(oldPath, newPath, function (err) {
    if (err) throw err
      console.log('Successfully renamed - RandomCase file moved!')
    })

    // Saves the randomQuery with a new usecase name
    fs.writeFileSync(randomCaseDir + randCaseName +'Query.json', JSON.stringify(randomCase, null, 4));   
    console.log("Case name changed.");
    //modify randomCase multiple times, each time select random number of features to modify
    var modifications = getRandModifications();
    console.log("modifications: "+modifications);
    for (let i = 0; i < noOfVersions; i++) {
      let randomCaseInstance = JSON.parse(JSON.stringify(randomCase));
      modifyCase(randomCaseInstance, randCaseName, modifications[i]);
      // Saves the randomQuery with a new usecase name and class modifications
      fs.writeFileSync(randomCaseDir + randCaseName + 'Query('+(modifications[i]+1)+').json', JSON.stringify(randomCaseInstance, null, 4));
    }
    console.log("Random case modified.");
  } else {
      console.log(randCaseName + " Directory already exists.");
  }
  
}

function replaceCaseName(randomQuery, randCaseName, extractedName) {
  randomQuery.hasDescription.hasAIModel.solves.instance = randomQuery.hasDescription.hasAIModel.solves.instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasAIModel.utilises.instance = randomQuery.hasDescription.hasAIModel.utilises.instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasUser.hasIntent.instance = randomQuery.hasDescription.hasUser.hasIntent.instance.replace(extractedName, randCaseName); //Usually no change
  randomQuery.instance = randomQuery.instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasAIModel.instance = randomQuery.hasDescription.hasAIModel.instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasAIModel.trainedOn.instance = randomQuery.hasDescription.hasAIModel.trainedOn.instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasUser.instance = randCaseName.concat("User");
  randomQuery.hasDescription.hasUser.possess.instance = randomQuery.hasDescription.hasUser.possess.instance.replace(extractedName, randCaseName);
}

function getRandModifications(){
  var arr = [...Array(Object.keys(allModifications).length).keys()];
  // console.log(arr);
  //shuffle array of indices
  let currentIndex = arr.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  // console.log(arr);
  arr = arr.splice(0, noOfVersions);
  // console.log(arr);
  return arr;
}

function modifyCase(randomQuery, randomCaseName, modifications) {
  modifications = modifications+1;
  // console.log("modifications: "+modifications);
  var usedKeys = [];
  while(modifications>0){
    const keys = Object.keys(allModifications);
    // console.log(keys);
    var randKey;
    do{
      randKey = keys[Math.floor(Math.random() * keys.length)];
      console.log("usedKeys: "+usedKeys);
      // console.log("randKey: "+randKey);
    } while (usedKeys.includes(randKey));

    usedKeys.push(randKey);
    // calling anonymous
    allModifications[randKey](randomQuery, randomCaseName);
    modifications = modifications - 1;
  } 
}

function removeSolution(randomQueGen) {
  var explainer;
  if (explainer = randomQueGen.hasDescription.hasExplainer) {
    explainer.instance = "";
    explainer.utilises.instance = "";
    explainer.utilises.hasOutputType.instance = "";
  }
  else {
    console.log('Exit');
  }
}


genRandomQuery();

