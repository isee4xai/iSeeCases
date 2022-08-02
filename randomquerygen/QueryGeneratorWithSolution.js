const fs = require('fs');
//Create a list of instance names
const caseNames = ["Apple", "Netflix", "Microsoft", "Amazon", "Samsung", "Nokia", "Meta", "Adidas", "Google", "Intel"];

const noOfVersions = 5;

var taxonomyData, aiTasks, intents, aiMethods;
fs.readFile('Taxonomy.json', 'utf8', (err, data) => {
  if (err) console.error(err);
  taxonomyData = JSON.parse(data);
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


var allModifications = {
  modifyAITask: function(randomQuery, randomCaseName) {
    var randTask = aiTasks[Math.floor(Math.random() * aiTasks.length)];
    randomQuery.hasDescription.hasAIModel.solves.classes = [randTask];
    randomQuery.hasDescription.hasAIModel.solves.instance = randomCaseName.concat(" ", randTask);
    // console.log("modifyAITask: "+randTask);
  },
  modifyIntent: function(randomQuery, randomCaseName) {
    var randIntent = intents[Math.floor(Math.random() * intents.length)];
    randomQuery.hasDescription.hasUser.hasIntent.classes = [randIntent];
    randomQuery.hasDescription.hasUser.hasIntent.instance = randomCaseName.concat(" ", randIntent);
    // console.log("modifyIntent: "+randIntent);
  },
  modifyAIMethod: function(randomQuery, randomCaseName) {
    var randMethod = aiMethods[Math.floor(Math.random() * aiMethods.length)];
    randomQuery.hasDescription.hasAIModel.utilises.classes = [randMethod];
    randomQuery.hasDescription.hasAIModel.utilises.instance = randomCaseName.concat(" ", randMethod);
    // console.log("modifyAIMethod: "+randMethod);
  },
  modifyDataType: function(randomQuery, randomCaseName) {
    var randDataType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
    randomQuery.hasDescription.hasAIModel.trainedOn.hasDataType.instance = randDataType;
    // console.log("modifyDataType: "+randDataType);
  },
  modifyResources: function(randomQuery, randomCaseName) {
    var randTechFacility = technicalFacilities[Math.floor(Math.random() * technicalFacilities.length)];
    randomQuery.hasDescription.hasUser.hasResources.instance = randTechFacility;
    // console.log("modifyResources: "+randTechFacility);
  },    
  modifyHandles: function(randomQuery, randomCaseName) {
    var randmodality= explanationModalities[Math.floor(Math.random() * explanationModalities.length)];
    // console.log("modifyHandles before: "+randomQuery.hasDescription.hasUser.hasResources.canHandle.instance);
    randomQuery.hasDescription.hasUser.hasResources.canHandle.instance = randmodality;
    // console.log("modifyHandles after: "+randmodality);
  },
  modifyLevelOfKnowledge: function(randomQuery, randomCaseName){
    var randknowledge = knowledgeLevels[Math.floor(Math.random() * knowledgeLevels.length)];
    randomQuery.hasDescription.hasUser.possess.levelOfKnowledge.instance = randknowledge;
    // console.log("modifyLevelOfKnowledge: "+randknowledge);
  },    
  modifyPortability: function(randomQuery, randomCaseName){
    var randVal = portabilities[Math.floor(Math.random() * portabilities.length)];
    randomQuery.hasDescription.hasExplainer.utilises.hasPortability.instance = randVal;
    // console.log("modifyPortability: "+randVal);
  },    
  modifyConcurrentness: function(randomQuery, randomCaseName){
    var randVal = concurrents[Math.floor(Math.random() * concurrents.length)];
    randomQuery.hasDescription.hasExplainer.utilises.hasConcurrentness.instance = randVal;
    // console.log("modifyConcurrentness: "+randVal);
  },    
  modifyExplanationScope: function(randomQuery, randomCaseName){
    var randVal = scopes[Math.floor(Math.random() * scopes.length)];
    randomQuery.hasDescription.hasExplainer.utilises.hasExplanationScope.instance = randVal;
    // console.log("modifyExplanationScope: "+randVal);
  },    
  modifyPresentation: function(randomQuery, randomCaseName){
    var randVal = presentations[Math.floor(Math.random() * presentations.length)];
    randomQuery.hasDescription.hasExplainer.utilises.hasPresentation.instance = randVal;
    // console.log("modifyPresentation: "+randVal);
  },    
  modifyTargetType: function(randomQuery, randomCaseName){
    var randVal = targets[Math.floor(Math.random() * targets.length)];
    randomQuery.hasDescription.hasExplainer.utilises.targetType.instance = randVal;
    // console.log("modifyTargetType: "+randVal);
  }
};


function genRandomQuery() {
  fs.readFile('SeedCase.json', 'utf8', (err, data) => {
    if (err) console.error(err);
    const allCases = JSON.parse(data);
    const keys = Object.keys(allCases);
    const randKey = keys[Math.floor(Math.random() * keys.length)];
    const randCase = allCases[randKey];

    try {
    // Convert pretty-print JSON object (random) to string - serialize JSON object (properly formatted)
    const caseData = JSON.stringify(randCase, null, 4);
    // Write JSON string to a new file
    fs.writeFileSync('RandomCase.json', caseData);
    console.log("Random case selected.");
    } catch (error) {
    console.error(err);
    }

    //Get a random case name
    const randomCaseName = caseNames[Math.floor(Math.random() * caseNames.length)];
    console.log("randomCaseName: " + randomCaseName);

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
  // Saves the randomQuery with a new usecase name
  // fs.writeFileSync('RandomQueryNameChanged.json', JSON.stringify(randomCase, null, 4));
  console.log("Case name changed.");

  //modify randomCase multiple times
  var modifications = getModifications();
  // console.log("modifications: "+modifications);
  for (let i = 0; i < noOfVersions; i++) {
    modifyCase(randomCase, randCaseName, modifications[i]);
    // Saves the randomQuery with a new usecase name and class modifications
    fs.writeFileSync(randCaseName + 'Query('+(modifications[i]+1)+').json', JSON.stringify(randomCase, null, 4));
    console.log("Random case modified.");
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

function getModifications(){
  var arr = [...Array(Object.keys(allModifications).length).keys()];
  // console.log(arr);
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
  console.log("modifications: "+modifications);
  var usedKeys = [];
  while(modifications>0){
    const keys = Object.keys(allModifications);
    // console.log(keys);
    var randKey;
    do{
      randKey = keys[Math.floor(Math.random() * keys.length)];
      // console.log("usedKeys: "+usedKeys);
      // console.log("randKey: "+randKey);
    } while (usedKeys.includes(randKey));

    usedKeys.push(randKey);
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