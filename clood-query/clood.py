from flatten import flatten_json
import json
import urllib.request, json 
import requests

class Clood:
    def __init__(self, CLOOD_PROJECT_ID, CLOOD_API_URL):
        self.CLOOD_PROJECT_ID = CLOOD_PROJECT_ID
        self.CLOOD_API_URL = CLOOD_API_URL

    def convert_to_clood(self, file_name):
        # iSee Case in Case Structure JSON Template
        with open(file_name, "r") as case_j:
            case = json.load(case_j)
        return self.convert_inner(case)

    def convert_inner(self, case_json):
        # CaseStructure => Clood
        with open("templates/CloodTemplate.json", "r") as conv_struct_j:
            conv_struct = json.load(conv_struct_j)

        converted_format = conv_struct
        flatten_case = flatten_json(case_json)
        for key, value in conv_struct.items():
            converted_format[key] = flatten_case[value]

        return converted_format

    def query(self, file):
        query_case = self.convert_to_clood(file)
        print(json.dumps(query_case, indent=4))
        url = self.CLOOD_API_URL+"/project/"+self.CLOOD_PROJECT_ID
        payload={}
        headers = {}
        response = requests.request("GET", url, headers=headers, data=payload)

        print(response.text)


    # This function will get the 17 seed cases from GitHub and add to the case base
    def seedcases(self):
        with urllib.request.urlopen("https://raw.githubusercontent.com/isee4xai/iSeeCases/main/seed-cases.json") as url:
            data = json.loads(url.read().decode())
            for case in data:
                converted = self.convert_inner(case)
                converted["Name"] = converted["Name"].replace("ExplanationExperience","")
                payload = {
                    "data": converted,
                    "projectId": self.CLOOD_PROJECT_ID
                }

                url = self.CLOOD_API_URL+"/retain"
                headers = {
                'Content-Type': 'application/json'
                }
                response = requests.request("POST", url, headers=headers, data=json.dumps(payload))
