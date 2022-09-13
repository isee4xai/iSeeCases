from clood import Clood
import json
import os
import sys 

##### CONFIGURATION #####
CLOOD_PROJECT_ID = "3353c7e2b00a42ec8ce21267e9adada1"
ISEE_CASES = "/Users/ike/dev/iSeeCases/seed-cases_2.json"
FOLDER_NAME = "RandomQuery"
FILE_NAME = "randcase.json"
topK = 3
#########################


CLOOD_API_URL    = "http://localhost:3000/dev"

print("-------------------------------------------")

clood = Clood(CLOOD_PROJECT_ID, CLOOD_API_URL)

# To Load 17 Cases in to - Do Only Once
clood.seedcases(ISEE_CASES)

# Sample Case Structure conversion
# query_case = clood.convert_to_clood(FILE_NAME)
# print(json.dumps(query_case, indent=4))

# Query Case Base
# retrieved_cases = clood.query(file=FILE_NAME, topK= topK , soln= ["SolutionExplanation", "SolutionBT"])
# for c in retrieved_cases:
#     print(c["Name"], c["score__"])

# print(json.dumps(retrieved_cases, indent=4))

# clood.export_cases(FILE_NAME, retrieved_cases)


# stdoutOrigin=sys.stdout 
# sys.stdout = open("log.txt", "w")
count = 0
cases = 0
## Browser through iSee Generated Random Queries
# for subdir, dirs, files in os.walk(FOLDER_NAME):
#     for f in files:
#          if f.lower().endswith((".json")):
#             print("----------------------")
#             print("File =>", subdir+" -> "+f)
#             count += 1
#             # Query Case Base
#             retrieved_cases = clood.query(file=os.path.join(subdir, f), topK= topK , soln= ["SolutionExplanation", "SolutionBT"])
#             for c in retrieved_cases:
#                 print(c["Name"], c["score__"])
#                 cases += 1
#
#             print("----------------------\n")
#
# print("\n\n--------Summary--------\n")
# print("Total Queries Ran = ", str(count))
# print("Total Retrieved Cases = ", str(cases))
# print("----------------------\n")
# sys.stdout.close()
# sys.stdout=stdoutOrigin