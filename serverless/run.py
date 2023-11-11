import json
import os
import tempfile

import requests
from dotenv import load_dotenv
from git import Repo

load_dotenv()
BASE_URL = os.environ.get("BASE_URL")
PASSWORD_HEADER = os.environ.get("PASSWORD_HEADER")

def make_api_request(request_data):

    # Make an HTTP POST request to the API
    url = f"{BASE_URL}/api/serverless/questions"
    try:
        print (request_data)
        response = requests.post(url, json=request_data, headers={"PASSWORD_HEADER": PASSWORD_HEADER})
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx and 5xx)
        
        print(f"API response status: {response.status_code}")
        print(f"API response: {response.json()}")
        return

    except requests.exceptions.RequestException as e:
        print(f"Error making the API request: {e}")
    
def load_problems():
    with tempfile.TemporaryDirectory() as base_path:
        Repo.clone_from("https://github.com/kyle8998/Practice-Coding-Questions.git", base_path)

        # Define the path to the "repo/leetcode" directory
        base_path += "/leetcode"
        problems = []

        # Iterate over the folders in the base directory
        for folder_name in os.listdir(base_path):
            folder_path = os.path.join(base_path, folder_name)
            
            # Check if the item is a directory
            if os.path.isdir(folder_path):
                problem_md_path = os.path.join(folder_path, "problem.md")
                
                # Check if "problem.md" exists in the folder
                if os.path.exists(problem_md_path):
                    # Open and read the contents of "problem.md"
                    with open(problem_md_path, "r", encoding="utf-8") as problem_file:
                        problem_contents = problem_file.read()
                        problems.append(problem_contents)
                else:
                    print(f"No problem.md found in {folder_name}")
    print(f"Total number of questions found: {len(problems)}")
    return problems

tags_to_search = ["Stack", "Array", "Tree", "Hash Table", "Binary Search"]

def parse(qn):
    try:
        qn = qn.split("\n")

        title = qn[0][2:]
        qn.pop(0)

        while qn[0].strip() == "":
            qn.pop(0)

        difficulty = qn[0].split(" ")[2].strip().upper()
        difficulty = difficulty[0].upper() + difficulty[1:].lower()

        qn.pop(0)
        while qn[0].strip() == "":
            qn.pop(0)

        qn = '\n'.join(qn)

        if difficulty not in ["Easy", "Medium", "Hard"]:
            return None

        if title.split(" ")[0] != "Problem" and title.split(" ")[1][-1] != ":":
            return None
        else:
            title = " ".join(title.split(" ")[2:])
            
        
        search_space = title + qn
        tags = []
        for tag in tags_to_search:
            if tag.lower() in search_space.lower():
                tags.append(tag)
                
        if tags == []:
            return None
            
        return { "title": title, "difficulty": difficulty, "description": qn, "tags": tags}
    except:
        return None

problems = load_problems()
problems = [parse(qn) for qn in problems]
problems = [qn for qn in problems if qn is not None]
print(f"Total number of questions parsed: {len(problems)}")

for qn in [problems[3]]:
    make_api_request(qn)
