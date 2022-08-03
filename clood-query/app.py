from clood import Clood
import json

##### CONFIGURATION #####
CLOOD_PROJECT_ID = "dd5fa3b559f14fae8f3525679aa65e11"
CLOOD_API_URL    = "http://localhost:3000/dev"
#########################

clood = Clood(CLOOD_PROJECT_ID, CLOOD_API_URL)

# To Load 17 Cases in to - Do Only Once
clood.seedcases()

# Sample Case Structure conversion
query_case = clood.convert_to_clood("randcase.json")

print(json.dumps(query_case, indent=4))

# Waiting for Clood Fix
# clood.query("randcase.json")
