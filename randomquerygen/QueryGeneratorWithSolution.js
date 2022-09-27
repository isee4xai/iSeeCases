const { json } = require('express/lib/response');
const fs = require('fs');
//Create a list of instance names
// const caseNames = ["Adidas","Alphabet","Amazon","Apple","Cisco","Foxconn","Google","Huawei","Hitachi","IBM","Intel","Lenovo",
// "Netflix","Nokia","Meta","Microsoft","Panasonic","Qualcomm","Samsung","Sony"];
const caseNames = ["Adidas","Alphabet"];


//cannot be larger than number of features to modify (9 at the moment)
const noOfVersions = 14; 

var taxonomyData, aiTasks, intents, aiMethods;
fs.readFile('Taxonomy.json', 'utf8', (err, data) => {
  if (err) console.error(err);
  taxonomyData = JSON.parse(data);
  //pre-load all taxonomies for future, 
  aiTasks = taxonomyData.solves.classes; //hasDescription.hasAIModel.solves.classes
  aiMethods = taxonomyData.utilises.classes; //hasDescription.hasAIModel.utilises.classes
  featureTypes = taxonomyData.hasFeatureType.instance; // hasDescription.hasAIModel.trainedOn.hasFeatureType.instance
  datasetTypes = taxonomyData.hasDatasetType.instance; //hasDescription.hasAIModel.trainedOn.hasDatasetType.instance
  portabilities = taxonomyData.hasPortability.instance; //hasDescription.hasExplanationRequirements.hasExplanationCriteria[0]
  concurrentness = taxonomyData.hasConcurrentness.instance;//hasDescription.hasExplanationRequirements.hasExplanationCriteria[1]
  presentations = taxonomyData.hasPresentation.classes; //hasDescription.hasExplanationRequirements.hasExplanationCriteria[2]
  explanationScopes = taxonomyData.hasExplanationScope.instance; //hasDescription.hasExplanationRequirements.hasExplanationCriteria[3]
  targetTypes = taxonomyData.targetType.instance; //hasDescription.hasExplanationRequirements.hasExplanationCriteria[4]
  intents = taxonomyData.hasIntent.classes; //hasDescription.hasUser.hasIntent.instance
  technicalFacilities = taxonomyData.hasResources.instance; //hasDescription.hasUser.hasResources.instance
  knowledgeLevels = taxonomyData.levelOfKnowledge.instance; //hasDescription.hasUser.possess[0].levelOfKnowledge.instance
  userQuestions = taxonomyData.hasQuestionTarget.classes; //hasDescription.hasUser.asks.hasQuestionTarget.classes
  rootNodes = taxonomyData.rootNode.classes;
  nodes = taxonomyData.nodes.classes;
  measures = taxonomyData.measures.instance;
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
    var onto='http://www.w3id.org/iSeeOnto/aimodel#';
    // randomQuery.hasDescription.hasAIModel.solves.classes = [randTask];
    // console.log("new aiTasks: "+ onto.concat(randTask));
    randomQuery.hasDescription.hasAIModel.solves.classes = onto.concat(randTask);
    randomQuery.hasDescription.hasAIModel.solves.instance = randomCaseName.concat(" ", randTask);
    console.log("modifyAITask: "+randTask);
  },
  modifyAIMethod: function(randomQuery, randomCaseName) {
    var randMethod = getRandomValue(randomQuery.hasDescription.hasAIModel.utilises.classes[0], aiMethods);
    var onto='http://www.w3id.org/iSeeOnto/aimodel#';
    // randomQuery.hasDescription.hasAIModel.utilises.classes = [randMethod];
    randomQuery.hasDescription.hasAIModel.utilises.classes = onto.concat(randMethod);
    // console.log("new aiMethods: "+ onto.concat(randMethod));
    randomQuery.hasDescription.hasAIModel.utilises.instance = randomCaseName.concat(" ", randMethod);
    console.log("modifyAIMethod: "+randMethod);
  },
  modifyFeatureType: function(randomQuery, randomCaseName) {
    var randFeatureType =  getRandomValue(randomQuery.hasDescription.hasAIModel.trainedOn.hasFeatureType.instance, featureTypes); //multiple values
    randomQuery.hasDescription.hasAIModel.trainedOn.hasFeatureType.instance = randFeatureType; //Change one value
    console.log("modifyFeatureType: "+randFeatureType);
  },
  modifyDatasetType: function(randomQuery, randomCaseName) {
    var randDatasetType =  getRandomValue(randomQuery.hasDescription.hasAIModel.trainedOn.hasDatasetType.instance, datasetTypes);
    randomQuery.hasDescription.hasAIModel.trainedOn.hasDatasetType.instance = randDatasetType;
    console.log("modifyDatasetType: "+randDatasetType);
  },
  modifyPortability: function(randomQuery, randomCaseName){
    var randPortability = getRandomValue(randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[0].requiredObjectValue, portabilities);
    randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[0].requiredObjectValue = randPortability; //onProperty: hasPortability, requiredObjectValue
    console.log("modifyPortability: "+randPortability); ////hasDescription.hasExplanationRequirements.hasExplanationCriteria.hasPortability
  },
   //concurrentness is always post-hoc
//   modifyConcurrentness: function(randomQuery, randomCaseName){
//     var randVal = concurrentness[Math.floor(Math.random() * concurrentness.length)];
//     randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria.hasConcurrentness.instance = randVal;
//     // console.log("modifyConcurrentness: "+randVal);
//   },       
  modifyPresentation: function(randomQuery, randomCaseName){
    var randPresentation = getRandomValue(randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[2].requiredValueType, presentations);
    console.log("randPresentation: "+randPresentation);
    randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[2].requiredValueType = randPresentation;
    console.log("modifyPresentation: "+randPresentation);
  },    
  modifyExplanationScope: function(randomQuery, randomCaseName){
    var randScope = getRandomValue(randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[3].requiredObjectValue, explanationScopes);
    randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[3].requiredObjectValue = randScope;
    console.log("modifyExplanationScope: "+randScope);
  }, 
  modifyTargetType: function(randomQuery, randomCaseName){
    var randTargetType= getRandomValue(randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[4].requiredObjectValue, targetTypes);
    randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[4].requiredObjectValue = randTargetType;
    console.log("modifyTargetType: "+randTargetType);
  },
  modifyResources: function(randomQuery, randomCaseName) {
    var randTechFacility = getRandomValue(randomQuery.hasDescription.hasUser.hasResources[0].instance, technicalFacilities); //Changing only one value
    // console.log("modifyResources: "+randTechFacility);
    randomQuery.hasDescription.hasUser.hasResources[0].instance = randTechFacility;
    console.log("modifyResources: "+randTechFacility);
  },    
  modifyLevelOfKnowledge: function(randomQuery, randomCaseName){
    // var lok = randomQuery.hasDescription.hasUser.possess;
    // const caseData = JSON.stringify(lok, null, 4);
    // console.log("caseData: "+caseData);
    var randKnowledge = getRandomValue(randomQuery.hasDescription.hasUser.possess[0].levelOfKnowledge.instance, knowledgeLevels);
    // console.log("randKnowledge: "+randKnowledge);
    var randKnowledge = getRandomValue(randomQuery.hasDescription.hasUser.possess[0].levelOfKnowledge.instance, knowledgeLevels);
    randomQuery.hasDescription.hasUser.possess[0].levelOfKnowledge.instance = randKnowledge;
    console.log("modifyLevelOfKnowledge: "+randKnowledge);
  },        
  modifyIntent: function(randomQuery, randomCaseName) {
    var randIntent = getRandomValue(randomQuery.hasDescription.hasUser.hasIntent.classes[0], intents);
    randomQuery.hasDescription.hasUser.hasIntent.classes = [randIntent];
    randomQuery.hasDescription.hasUser.hasIntent.instance = randomCaseName.concat(" ", randIntent);
    console.log("modifyIntent: "+randIntent);
  },
  modifyUserQuestions: function(randomQuery, randomCaseName) {
    var randQuestions = getRandomValue(randomQuery.hasDescription.hasUser.asks.hasQuestionTarget.classes[0], userQuestions);
    // console.log("randQuestions: "+randQuestions);
    randomQuery.hasDescription.hasUser.asks.hasQuestionTarget.classes = [randQuestions];
    randomQuery.hasDescription.hasUser.asks.hasQuestionTarget.instance = randomCaseName.concat(" ", randQuestions);
    console.log("modifyUserQuestions: "+randQuestions);
  },
  modifyRootNodes: function(randomQuery, randomCaseName) {
    var randRootNodes = getRandomValue(randomQuery.hasSolution.data.trees[0].rootNode.classes[0], rootNodes); //multiple values for trees
    randomQuery.hasSolution.data.trees[0].rootNode.classes = [randRootNodes]; 
    randomQuery.hasSolution.data.trees[0].rootNode.classes[0] = randomCaseName.concat(" ", randRootNodes);
    console.log("modifyUserQuestions: "+randRootNodes);
},
  modifyNodes: function(randomQuery, randomCaseName) {
    var randNodes = getRandomValue(randomQuery.hasSolution.data.trees[0].nodes[0].classes[0], nodes); //array
    randomQuery.hasSolution.data.trees[0].nodes[0].classes = [randNodes];
    randomQuery.hasSolution.data.trees[0].nodes[0].classes[0] = randomCaseName.concat(" ", randNodes);
    console.log("modifyUserQuestions: "+randNodes);
}
//   modifyMeasures: function(randomQuery, randomCaseName) {}
};
//14 to 15 properties

function genRandomQuery() {
  fs.readFile('seed-cases.json', 'utf8', (err, data) => {
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
  //Assign empty value to the hasExplanationRequirements instance
  removeSolution(randomCase);

  console.log("aiTasks: "+ randomCase.hasDescription.hasAIModel.solves.classes[0]);
  console.log("aiMethods: "+ randomCase.hasDescription.hasAIModel.utilises.classes[0]);
//   console.log(randomCase.hasDescription.hasAIModel.trainedOn.hasFeatureType[1]!=null);
  if(randomCase.hasDescription.hasAIModel.trainedOn.hasFeatureType[1]!=null){
     console.log("featureTypes: "+ randomCase.hasDescription.hasAIModel.trainedOn.hasFeatureType[0].instance,","+randomCase.hasDescription.hasAIModel.trainedOn.hasFeatureType[1].instance); //array
  }
  else
    console.log("featureTypes: "+ randomCase.hasDescription.hasAIModel.trainedOn.hasFeatureType.instance);
  console.log("datasetTypes: "+ randomCase.hasDescription.hasAIModel.trainedOn.hasDatasetType.instance); 
  console.log("intents: "+ randomCase.hasDescription.hasUser.hasIntent.instance); 
  console.log("userQuestions: "+ randomCase.hasDescription.hasUser.asks.hasQuestionTarget.classes[0]); 
//   console.log(randomCase.hasDescription.hasUser.hasResources[1]!=null);
  if(randomCase.hasDescription.hasUser.hasResources[1]!=null){
  console.log("technicalFacilities: "+ randomCase.hasDescription.hasUser.hasResources[0].instance,","+ randomCase.hasDescription.hasUser.hasResources[1].instance); //array
  }
  else
   console.log("technicalFacilities: "+ randomCase.hasDescription.hasUser.hasResources.instance);
  console.log("knowledgeLevels: "+ randomCase.hasDescription.hasUser.possess[0].levelOfKnowledge.instance); //array
  console.log("portabilities: "+ randomCase.hasDescription.hasExplanationRequirements.hasExplanationCriteria[0].requiredObjectValue); //hasExplanationCriteria is an array
  console.log("concurrentness: "+ randomCase.hasDescription.hasExplanationRequirements.hasExplanationCriteria[1].requiredObjectValue); 
  console.log("presentations: "+ randomCase.hasDescription.hasExplanationRequirements.hasExplanationCriteria[2].requiredValueType); 
  console.log("explanationScopes: "+ randomCase.hasDescription.hasExplanationRequirements.hasExplanationCriteria[3].requiredObjectValue); 
  console.log("targetTypes: "+ randomCase.hasDescription.hasExplanationRequirements.hasExplanationCriteria[4].requiredObjectValue); 
  console.log("rootNode: "+ randomCase.hasSolution.data.trees[0].rootNode.classes[0]);
  console.log("nodes: "+ randomCase.hasSolution.data.trees[0].nodes[0].classes[0]);

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
  randomQuery.instance = randomQuery.instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.instance = randomQuery.hasDescription.instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasAIModel.instance = randomQuery.hasDescription.hasAIModel.instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasAIModel.solves.instance = randomQuery.hasDescription.hasAIModel.solves.instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasAIModel.utilises.instance = randomQuery.hasDescription.hasAIModel.utilises.instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasAIModel.trainedOn.instance = randomQuery.hasDescription.hasAIModel.trainedOn.instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[0].instance = randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[0].instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[1].instance = randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[1].instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[2].instance = randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[2].instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[3].instance = randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[3].instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[4].instance = randomQuery.hasDescription.hasExplanationRequirements.hasExplanationCriteria[4].instance.replace(extractedName, randCaseName);
  randomQuery.hasDescription.hasUser.possess[0].instance = randomQuery.hasDescription.hasUser.possess[0].instance.replace(extractedName, randCaseName); 
  randomQuery.hasDescription.hasUser.possess[1].instance = randomQuery.hasDescription.hasUser.possess[1].instance.replace(extractedName, randCaseName); 
  randomQuery.hasDescription.hasUser.asks.instance = randomQuery.hasDescription.hasUser.asks.instance.replace(extractedName, randCaseName); //Usually no change
  randomQuery.hasDescription.hasUser.asks.hasQuestionTarget.instance = randomQuery.hasDescription.hasUser.asks.hasQuestionTarget.instance.replace(extractedName, randCaseName); //Usually no change
  randomQuery.hasDescription.hasUser.instance = randCaseName.concat("User");
  randomQuery.hasSolution.instance = randomQuery.hasSolution.instance.replace(extractedName, randCaseName);
  randomQuery.hasSolution.data.instance = randomQuery.hasSolution.data.instance.replace(extractedName, randCaseName);
  randomQuery.hasSolution.data.selectedTree = randomQuery.hasSolution.data.selectedTree.replace(extractedName, randCaseName);
  randomQuery.hasSolution.data.trees[0].instance = randomQuery.hasSolution.data.trees[0].instance.replace(extractedName, randCaseName);
  randomQuery.hasSolution.data.trees[0].rootNode.instance = randomQuery.hasSolution.data.trees[0].rootNode.instance.replace(extractedName, randCaseName);
  randomQuery.hasSolution.data.trees[0].rootNode.firstChild = randomQuery.hasSolution.data.trees[0].rootNode.firstChild.replace(extractedName, randCaseName);
  randomQuery.hasSolution.data.trees[0].nodes[0].instance = randomQuery.hasSolution.data.trees[0].nodes[0].instance.replace(extractedName, randCaseName); 
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
  if (explainer = randomQueGen.hasDescription.hasExplanationRequirements) {
    explainer.instance = "";
    // explainer.hasExplanationCriteria.instance = "";
    // explainer.hasExplanationCriteria.hasOutputType.instance = "";
  }
  else {
    console.log('Exit');
  }
}

genRandomQuery();

