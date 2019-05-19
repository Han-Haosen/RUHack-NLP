# RU-Hack Natural Language Processing Backend

This repo contains Backend for the ru-hacks Project. 
Our objective was to minimize the time that people spend reading documents, make the task less daunting and so we created a web application, Nutt-Shell that summarizes the important details from a given image/scan of a document. We use Google Cloud Vision api to do OCR processing (Character Recognition), Google NLP api for further analysis (important keyword tokenization) and MeaningCloud api to generate summary, as well as hyper linked keywords, allowing users to view definitions and or history about the keywords. The following the potential applications of Nutt-Shell: - Decrease the time spent reading and analyzing large documents, (save time + money) - Give student a opportunity to make notes using the simplified note from the summary, - Banks or any other business that use contracts everyday this can help simplify those contract and improve response time.(Both: Business and Clients can use)


## Install/Build Instructions:
 - Enable Google Vision and NLP apis from Google Cloud Console Dashboard. (A valid billing account is required)
 - Download the json with the key and save it somewhere safe on your computer
 - Create an environment variable GOOGLE_APPLICATION_CREDENTIALS and set it to the path to the download file put full path in quotes
 - Install NodeJS
 - Clone the repository from github.
 - run the following commands in the cloned repository on your computer
 - npm install 
 - npm start
 - Now the server should be running on localhost port 3000. (http://localhost:3000/)
 - Upload image to server using the upload form.
 - Give the server about 10-15 Seconds to analyze the picture and return the results

GROUP:
- David: https://github.com/DavidM-Dev
- Carvos: https://github.com/Han-Haosen/
- Muhammad: https://github.com/M-Faheem-Khan
