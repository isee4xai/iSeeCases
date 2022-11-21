from flatten import flatten_json
import json
import urllib.request, json 
import requests
import copy
import os

from cldcbjson import clood_format


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
        return clood_format(case_json)

    # def convert_inner(self, case_json):
    #     # CaseStructure => Clood
    #     with open("templates/CloodTemplate.json", "r") as conv_struct_j:
    #         conv_struct = json.load(conv_struct_j)
    #
    #     converted_format = conv_struct
    #     flatten_case = flatten_json(case_json)
    #     for key, value in conv_struct.items():
    #         converted_format[key] = flatten_case[value]
    #
    #     # FOR FUTURE SOLUTION PART
    #     converted_format["SolutionBT"] = "BT JSON"
    #     return converted_format

    def query(self, file, topK, soln):
        print("❓ Starting Query for " + file + " for topK="+str(topK))
        print("")
        query_case = self.convert_to_clood(file)
        url = self.CLOOD_API_URL+"/project/"+self.CLOOD_PROJECT_ID
        payload = {}
        headers = {}
        response = requests.request("GET", url, headers=headers, data=payload)
        conv_res = response.json()
        arr = []
        for attrib in conv_res['attributes']:
            attrib_sort = { 
                "name": attrib["name"] , 
                "type": attrib["type"],
                "similarity": attrib["similarity"], 
                "weight": attrib["weight"], 
                "value": query_case[attrib["name"]],
                "unknown": attrib["name"] in soln, 
                "strategy": "Best Match" 
            }

            # Conversion for Query Intersecrion
            if attrib['similarity'] == 'Query Intersection':
                attrib_sort["value"] = [ query_case[attrib["name"]] ]

            arr.append(attrib_sort)
        
        url = self.CLOOD_API_URL+"/retrieve"
        payload={ "data":arr,"topk": topK,"globalSim": "Weighted Sum", "projectId": self.CLOOD_PROJECT_ID}
        headers = {}
        #response = requests.request("POST", url, headers=headers, data=json.dumps(payload))
        print(payload)
        retrv_res = response.json()
        print("🟢 Completed retrieval")
        print("")
        return retrv_res["bestK"]


    def export_cases(self, file, retrieved_cases, isee_cases_file):
        print("Exporting Matched Cases")
        print("")
        if not os.path.exists("export"):
            os.mkdir("export")

        with open(isee_cases_file) as json_file:
            json_data = json.load(json_file)

            index = 1
            for case in retrieved_cases:
                for isee_case in json_data:
                    if case['id'] == isee_case['id']:
                        filename = 'export/' + file + '_matched_case_' + str(index) + '.json'
                        with open(filename, 'w') as f:
                            json.dump(json.loads(json.loads(case)), fp=f, indent=4)
                            print("----- ✅ Exporting Case "+str(index) + " -> " + filename)
                            print("")

                index += 1

    # def export_cases(self,file, retrieved_cases):
    #     print("Exporting Matched Cases")
    #     print("")
    #     if not os.path.exists("export"):
    #         os.mkdir("export")
    #
    #     with urllib.request.urlopen("https://raw.githubusercontent.com/isee4xai/iSeeCases/main/case-structure.json?v1") as url:
    #         data = json.dumps(url.read().decode())
    #         index = 1
    #         for case in retrieved_cases:
    #             with open("templates/CloodTemplate.json", "r") as conv_struct_j:
    #                 conv_struct = json.load(conv_struct_j)
    #             temp = copy.deepcopy(data)
    #             temp = temp.replace("<casename>", str(case["Name"]))
    #
    #             for key, value in conv_struct.items():
    #                 temp = temp.replace("<"+key+">", str(case[key]))
    #             filename = 'export/'+file+'_matched_case_'+str(index)+'.json'
    #             with open(filename, 'w') as f:
    #                 json.dump(json.loads(json.loads(temp)), fp=f, indent=4)
    #                 print("----- ✅ Exporting Case "+str(index)+" -> "+ filename)
    #                 print("")
    #
    #             index +=1

    # This function will get the 17 seed cases from GitHub and add to the case base
    def seedcases(self, filename):
        print("Preloading with Seed Cases ✅")
        # with open(filename, "r") as case_j:
        #     cases = json.load(case_j)  # read isee cases json
        cases = self.convert_to_clood(filename)  # convert to clood format
        for case in cases:
            payload = {
                "data": case,
                "projectId": self.CLOOD_PROJECT_ID
            }

            url = self.CLOOD_API_URL+"/retain"
            headers = {
            'Content-Type': 'application/json'
            }
            response = requests.request("POST", url, headers=headers, data=json.dumps(payload))
            print(payload)



    # def seedcases(self):
    #     print("Preloading with Seed Cases ✅")
    #     with urllib.request.urlopen("https://raw.githubusercontent.com/isee4xai/iSeeCases/main/seed-cases.json") as url:
    #         data = json.loads(url.read().decode())
    #         for case in data:
    #             converted = self.convert_inner(case)
    #             converted["Name"] = converted["Name"].replace("ExplanationExperience","")
    #             payload = {
    #                 "data": converted,
    #                 "projectId": self.CLOOD_PROJECT_ID
    #             }
    #
    #             url = self.CLOOD_API_URL+"/retain"
    #             headers = {
    #             'Content-Type': 'application/json'
    #             }
    #             #response = requests.request("POST", url, headers=headers, data=json.dumps(payload))
    #             print(payload)
