from clood import Clood
import json

##### CONFIGURATION #####
CLOOD_PROJECT_ID = "cf9c88425c214a57a22c76dc00de2caa"
CLOOD_API_URL    = "http://localhost:3000/dev"
FILE_NAME = "randcase.json"
topK = 5
#########################



print("-------------------------------------------")

clood = Clood(CLOOD_PROJECT_ID, CLOOD_API_URL)

# To Load 17 Cases in to - Do Only Once
# clood.seedcases()

# Sample Case Structure conversion
# query_case = clood.convert_to_clood(FILE_NAME)
# print(json.dumps(query_case, indent=4))

# Query Case Base
retrieved_cases = clood.query(file=FILE_NAME, topK= topK , soln= ["SolutionExplanation", "SolutionBT"])
# print(json.dumps(retrieved_cases, indent=4))

clood.export_cases(FILE_NAME, retrieved_cases)