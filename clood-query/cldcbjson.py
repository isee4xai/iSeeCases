import json
from flatten import flatten_json
import uuid

# json_data = ''
# with open("../seed-cases.json") as json_file:
#     json_data = json.load(json_file)

# print(json_data)
# print(json.dumps(json_data[4], indent=2))

def extract_property(prop_relation, prop_array):
    val = None
    for obj in prop_array:
        if obj['http://www.w3id.org/iSeeOnto/explanationexperience#onProperty'] == prop_relation:
            val = obj.get('http://www.w3id.org/iSeeOnto/explanationexperience#requiredObjectValue')
            if val is None:
                val = obj.get('http://www.w3id.org/iSeeOnto/explanationexperience#requiredValueType')
    return val


def extract_all_instances(prop_array):
    val = []
    if type(prop_array) is list:  # check to deal with inconsistency where single instances are passed as object instead of array e.g. 'hasFeatureType'
        for obj in prop_array:
            if obj.get('instance') is not None:
                val.append(obj.get('instance'))
    else:
        val.append(prop_array.get('instance'))
    return val

def extract_instance_with_class(class_value, prop_array, prop_relation):
    for obj in prop_array:
        if obj.get(prop_relation) is not None:
            return obj[prop_relation].get('instance')
        # if class_value in obj.get('classes'):
        #     return obj[prop_relation].get('instance')
    return None

def extract_class_with_relation(prop_array, prop_relation):
    for obj in prop_array:
        if obj.get(prop_relation) is not None:
            return obj[prop_relation]['classes'][0]
    return None

def extract_case(entry):
    case_ins = {}
    uid = uuid.uuid4()
    case_ins['id'] = entry.get('id', uid.hex)
    case_ins['Name'] = entry.get('instance')
    # case_ins['DataType'] = ?
    case_ins['DatasetType'] = extract_instance_with_class("http://www.w3id.org/iSeeOnto/explainer#DatasetType", entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasAIModel']['http://www.w3id.org/iSeeOnto/aimodel#trainedOn'], "http://www.w3id.org/iSeeOnto/aimodel#hasDatasetType")
    # case_ins['DatasetFeatureType'] = extract_all_instances(entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasAIModel']['http://www.w3id.org/iSeeOnto/aimodel#trainedOn']['http://www.w3id.org/iSeeOnto/aimodel#hasFeatureType'])
    # case_ins['NumberOfFeatures'] = entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasAIModel']['http://www.w3id.org/iSeeOnto/aimodel#trainedOn']['numberOfFeatures']['value']
    # case_ins['NumberOfInstances'] = entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasAIModel']['http://www.w3id.org/iSeeOnto/aimodel#trainedOn']['numberOfInstances']['value']
    case_ins['AITask'] = entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasAIModel']['http://www.w3id.org/iSeeOnto/aimodel#solves']['classes'][0]
    case_ins['AIMethod'] = entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasAIModel']['http://www.w3id.org/iSeeOnto/explainer#utilises']['classes'][0]
    case_ins['Portability'] = extract_property('http://www.w3id.org/iSeeOnto/explainer#hasPortability', entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasExplanationRequirements']['http://www.w3id.org/iSeeOnto/explanationexperience#hasExplanationCriteria'])
    case_ins['ExplainerConcurrentness'] = extract_property('http://www.w3id.org/iSeeOnto/explainer#hasConcurrentness', entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasExplanationRequirements']['http://www.w3id.org/iSeeOnto/explanationexperience#hasExplanationCriteria'])
    case_ins['ExplanationScope'] = extract_property('http://www.w3id.org/iSeeOnto/explainer#hasExplanationScope', entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasExplanationRequirements']['http://www.w3id.org/iSeeOnto/explanationexperience#hasExplanationCriteria'])
    case_ins['ExplanationTarget'] = extract_property('http://www.w3id.org/iSeeOnto/explainer#targetType', entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasExplanationRequirements']['http://www.w3id.org/iSeeOnto/explanationexperience#hasExplanationCriteria'])
    case_ins['ExplanationPresentation'] = extract_property('http://www.w3id.org/iSeeOnto/explainer#hasPresentation', entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasExplanationRequirements']['http://www.w3id.org/iSeeOnto/explanationexperience#hasExplanationCriteria'])
    case_ins['UserIntent'] = entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasUserGroup']['http://www.w3id.org/iSeeOnto/user#hasIntent']['instance']
    case_ins['TechnicalFacilities'] = extract_all_instances(entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasUserGroup']['http://www.w3id.org/iSeeOnto/user#hasResources'])
    # case_ins['ExplanationModality'] = ?
    case_ins['UserDomain'] = entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasUserGroup']['http://www.w3id.org/iSeeOnto/user#possessKnowledgeOf']['instance']
    case_ins['AIKnowledgeLevel'] = extract_instance_with_class("http://www.w3id.org/iSeeOnto/user#AIMethodKnowledge", entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasUserGroup']['https://purl.org/heals/eo#possess'], "http://www.w3id.org/iSeeOnto/user#levelOfKnowledge")
    case_ins['DomainKnowledgeLevel'] = extract_instance_with_class("http://www.w3id.org/iSeeOnto/user#DomainKnowledge",
                                                            entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasUserGroup']['https://purl.org/heals/eo#possess'], "http://www.w3id.org/iSeeOnto/user#levelOfKnowledge")
    case_ins['UserQuestionTarget'] = extract_class_with_relation(entry['http://www.w3id.org/iSeeOnto/explanationexperience#hasDescription']['http://www.w3id.org/iSeeOnto/explanationexperience#hasUserGroup']['https://purl.org/heals/eo#asks'], "http://www.w3id.org/iSeeOnto/user#hasQuestionTarget")
    case_ins['Solution'] = entry.get('http://www.w3id.org/iSeeOnto/explanationexperience#hasSolution')
    return case_ins

def clood_format(json_data):
    if isinstance(json_data,list):
        clood_cases = []
        for entry in json_data:
            clood_cases.append(extract_case(entry))
        return clood_cases
    else:
        return extract_case(json_data)

# print(clood_cases[0])
# print(json.dumps(clood_cases[0], indent=2))

# flatten_case = flatten_json(json_data[0])
# print(flatten_case)

def add_case_ids():
    # json_data = []
    with open("../seed-cases.json") as json_file:
        json_data = json.load(json_file)
    for entry in json_data:
        uid = uuid.uuid4()
        entry['id'] = uid.hex

    # output
    with open("../seed-cases.json", 'w') as json_file:
        json.dump(json_data, json_file, indent=2)

    # Closing file
    json_file.close()


# add_case_ids()
# with open("../seed-cases.json") as json_file:
#     json_data = json.load(json_file)
#     clood_format(json_data)
