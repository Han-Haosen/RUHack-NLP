# NoName Project

We are making a program that will allow you to upload a picture that contains text (e.g. from a textbook), and receive a typed-up version of that same text, with important words highlighted with urls for all the technical words you don't understand. 

APIs in use:
- OCR API by SemaMediaData (to extract text from images) https://rapidapi.com/SemaMediaData/api/image-ocr?endpoint=544772fde4b05b7eccf8958d
- Google NLP Entity Analysis API (to identify important words) https://cloud.google.com/natural-language/docs/analyzing-entities
- Google Search API (to find useful links for each keyword) https://developers.google.com/custom-search/v1/using_rest

In other words, we're letting you take a picture of something and convert it into its own wikipedia page. 
