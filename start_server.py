import os
import json


def check_folder(name):   
    if os.path.exists(str(os.getcwd()) + '\\' + name) == False:
        path = os.path.join(os.getcwd(), name)
        os.mkdir(path)
check_folder('visitor_tag')
check_folder('json_files')

#write the past_time file if it doesn't exist
if os.path.exists(str(os.getcwd()) + '\\json_files\\past_time.json') == False:
    # 11/05/2020 13:09:11
    data = {"time" : 1604599751583} 
    with open('json_files/past_time.json', 'w') as outfile:
        json.dump(data, outfile)

#write the location file if it doesn't exist
if os.path.exists(str(os.getcwd()) + '\\json_files\\location.json') == False:
    location = input("Please enter you city and state. Ex: City, State:\t")
    data = {"location" : location}
    with open('json_files/location.json', 'w') as outfile:
        json.dump(data, outfile)

#install and start the program
os.system('npm install')
os.system('npm start')

