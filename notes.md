                  GitHub
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
     frontend    backend      main
       branch     branch       branch
        │           │           │
        └───────────┴───────────┘
                    ↓
             merge into main
                    ↓
          ┌─────────┴─────────┐
          ↓                   ↓
       Vercel               Render
     frontend/              backend/
        ↓                     ↓
    blognest.vercel.app     blognest-api.onrender.com
                                  ↓
                              MySQL


main
│
├── frontend/
│
├── backend/
│
├── .gitignore
└── README.md


git checkout main
git merge frontend
git push origin main


git merge backend
git push origin main


# while deploying on the render - backend
1. Root Directory
Enter : backend (This tells Render: "My Node.js application is inside the backend folder.")