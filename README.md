# CodeChronicle (Team 06 - CSE 210 - FA24)

---

## Videos

Video 1 – Pitch: [https://youtu.be/bQFjssdjmzM](https://www.youtube.com/watch?v=bQFjssdjmzM) \
Video 2 – Key Learnings: [https://youtu.be/moRwtbQ1b7U ](https://www.youtube.com/watch?v=moRwtbQ1b7U) \
Video 3 - Code Walkthrough: [https://www.youtube.com/watch?v=DnEjdeTYTwg](https://www.youtube.com/watch?v=DnEjdeTYTwg)

---

## Mission Statement

Software development involves a continuous flow of tasks, ideas, and technical solutions that often get scattered across multiple tools or become difficult to retrieve over time. Developers frequently need to keep track of work sessions, code snippets, and notes on project progress, but traditional journaling or task management tools are not tailored to address these specific needs. Current solutions are too complex, which introduces decision fatigue. This leaves developers overwhelmed as they need to navigate a steep learning curve and spend time configuring tools instead of focussing on their core tasks. Other simple solutions in general lack streamlined integration with developer workflows, particularly with code management, task prioritization, and knowledge retrieval. As a result, developers struggle to efficiently organize, reflect on, and recall essential information that could drive more informed decision-making and productive work habits.

CodeChronicle aims to create a simple journal for developers, a specialized tool designed to meet the unique needs of software developers. CodeChronicle is an intuitive platform where developers can document their tasks, ideas, code snippets, and self-reflections. By offering features like searchable tags, secure storage for sensitive information, and context aware question answering, this journal aims to bridge the gap between comprehensive task, project and code management while maintaining the intuitiveness of a notebook.

---

## UI Overview

![Image (1)](https://github.com/user-attachments/assets/8b577c20-e081-4233-b69d-17b2bb1295c2)

![Image (2)](https://github.com/user-attachments/assets/805ecdd8-e643-41b6-99dc-5af76104065c)

![Image (3)](https://github.com/user-attachments/assets/a7365a2d-5277-4db2-8f7f-627a4c51663e)

![Image (4)](https://github.com/user-attachments/assets/97c7a9e4-bc40-4877-a00a-2bde2146487a)

![Image (5)](https://github.com/user-attachments/assets/79dc5bc6-47c1-4ace-a721-9d395c47fe75)

![Image (6)](https://github.com/user-attachments/assets/c2437fe5-0e41-4243-9cd2-8ab876b53375)

![Image (7)](https://github.com/user-attachments/assets/2c380879-35be-421b-9db2-5017f864aec8)

---

## How to Install and Run the Journal

1. Clone the repository `git clone https://github.com/CSE210Team-06/cse210-fa24-group06.git`
2. For the frontend, run `cd frontend` in the terminal, then `npm install`, and finally run `npm start`.
3. The backend is hosted on render [here](https://cse210-fa24-group06.onrender.com), its on a free version of render so it shuts down after some time of inactivity. Try signing up or logging in, and if its not working, then try after a few mins as your first sign up or log in will trigger render to activate the hosted version again.
4. If you want to run the backend locally, run `cd backend`, then `pip install -r requirements.txt`, and finally run `uvicorn main:app --reload --port <PORT_NUMBER>`
5. Make sure to modify the `API_BASE_URL` inside `frontend/constants/constants.js` in case you are running both frontend and backend locally.

---

## Documentation

1. Frontend Auto Documentation - [https://cse210team-06.github.io/cse210-fa24-group06-docs/](https://cse210team-06.github.io/cse210-fa24-group06-docs/)
2. Backend Auto Documentation - [https://cse210team-06.github.io/cse210-fa24-group06-backend-docs/backend.html](https://cse210team-06.github.io/cse210-fa24-group06-backend-docs/backend.html)
3. Backend FastAPI Auto Documentation and Postman style API trials - [https://cse210-fa24-group06.onrender.com](https://cse210-fa24-group06.onrender.com)\*
4. Frontend Auto Documentation Repo - [https://github.com/CSE210Team-06/cse210-fa24-group06-docs](https://github.com/CSE210Team-06/cse210-fa24-group06-docs)
5. Backend Auto Documentation - [https://github.com/CSE210Team-06/cse210-fa24-group06-backend-docs](https://github.com/CSE210Team-06/cse210-fa24-group06-backend-docs)

\* FastAPI docs may not be immediately available, as render might have shut down due to inactivity. Check Step 3 of **How to Install and Run the Journal** (the section above) to get more details.

---

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.

---

## Maintainers

#### Team 06

- [Sushaanth Srinivasan](https://github.com/SushaanthSrinivasan)
- [Sahil Deshmukh](https://github.com/sahil139)
- [Nishant Rajadhyaksha](https://github.com/nishant42491)
- [Vincent Thai](https://github.com/vthai321)
- [U Lam Lou](https://github.com/uloulou)
- [Gagan Mundada](https://github.com/GaganVM)
- [Vedant Deshpande](https://github.com/vedantd41)
- [Ethan Lee](https://github.com/EthanLDot)
- [Steve Taylor](https://github.com/stevegtaylor)

---

## License

This project is licensed under the MIT License.
Copyright 2024, cse210-fa24-group06

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Special Thanks

Special thanks to Prof. Thomas Powell, our CSE 210 professor and our TA in-charge Cora Coleman.

---
