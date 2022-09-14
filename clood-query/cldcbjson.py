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
        if obj['onProperty'] == prop_relation:
            val = obj.get('requiredObjectValue')
            if val is None:
                val = obj.get('requiredValueType')
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

def extract_instance_with_class(class_value, prop_array):
    for obj in prop_array:
        if class_value in obj.get('classes'):
            return obj['levelOfKnowledge'].get('instance')
    return None

def clood_format(json_data):
    clood_cases = []
    for entry in json_data:
        case = {}
        case['id'] = entry.get('id')
        case['Name'] = entry.get('instance')
        # case['DataType'] = ?
        case['DatasetType'] = entry['hasDescription']['hasAIModel']['trainedOn']['hasDatasetType']['instance']
        # case['DatasetFeatureType'] = extract_all_instances(entry['hasDescription']['hasAIModel']['trainedOn']['hasFeatureType'])
        # case['NumberOfFeatures'] = entry['hasDescription']['hasAIModel']['trainedOn']['numberOfFeatures']['value']
        # case['NumberOfInstances'] = entry['hasDescription']['hasAIModel']['trainedOn']['numberOfInstances']['value']
        case['AITask'] = entry['hasDescription']['hasAIModel']['solves']['classes'][0]
        case['AIMethod'] = entry['hasDescription']['hasAIModel']['utilises']['classes'][0]
        case['Portability'] = extract_property('hasPortability', entry['hasDescription']['hasExplanationRequirements']['hasExplanationCriteria'])
        case['ExplainerConcurrentness'] = extract_property('hasConcurrentness', entry['hasDescription']['hasExplanationRequirements']['hasExplanationCriteria'])
        case['ExplanationScope'] = extract_property('hasExplanationScope', entry['hasDescription']['hasExplanationRequirements']['hasExplanationCriteria'])
        case['ExplanationTarget'] = extract_property('targetType', entry['hasDescription']['hasExplanationRequirements']['hasExplanationCriteria'])
        # case['ExplanationPresentation'] = extract_property('hasPresentation', entry['hasDescription']['hasExplanationRequirements']['hasExplanationCriteria'])
        case['UserIntent'] = entry['hasDescription']['hasUser']['hasIntent']['instance']
        case['TechnicalFacilities'] = extract_all_instances(entry['hasDescription']['hasUser']['hasResources'])
        # case['ExplanationModality'] = ?
        case['AIKnowledgeLevel'] = extract_instance_with_class("AI Method Knowledge", entry['hasDescription']['hasUser']['possess'])
        case['DomainKnowledgeLevel'] = extract_instance_with_class("Domain Knowledge",
                                                               entry['hasDescription']['hasUser']['possess'])
        case['UserQuestion'] = entry['hasDescription']['hasUser']['asks']['hasQuestionTarget']['classes'][0]
        case['Solution'] = entry.get('hasSolution')
        clood_cases.append(case)
        # print(json.dumps(entry, indent=2))
    # print(json.dumps(clood_cases[0], indent=2))
    return clood_cases

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
