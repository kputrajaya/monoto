# Monoto

Note taking app, text editor feel.

## Built With

- [Preact](https://preactjs.com/)
- [Firebase](https://firebase.google.com/)
- [React Helmet](https://github.com/nfl/react-helmet)
- [React Grid System](https://github.com/sealninja/react-grid-system)
- [React CodeMirror2](https://github.com/scniro/react-codemirror2)
- [Marked](https://github.com/markedjs/marked)
- [React Hotkeys Hook](https://github.com/JohannesKlauss/react-hotkeys-hook)
- [SVGR](https://react-svgr.com/)
- [Vercel](https://vercel.com/)

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fkiloev%2Fmonoto&env=FIREBASE_API_KEY,FIREBASE_AUTH_DOMAIN,FIREBASE_DATABASE_URL,FIREBASE_PROJECT_ID,FIREBASE_STORAGE_BUCKET,FIREBASE_MESSAGING_SENDER_ID,FIREBASE_APP_ID,FIREBASE_MEASUREMENT_ID&envDescription=The%20values%20of%20your%20Firebase%20config%20object.&envLink=https%3A%2F%2Ffirebase.google.com%2Fdocs%2Fweb%2Fsetup&project-name=monoto&repo-name=monoto&demo-title=Monoto&demo-description=Note%20taking%20app%2C%20text%20editor%20feel&demo-url=https%3A%2F%2Fmonoto.app&demo-image=https%3A%2F%2Fmonoto.app%2Fassets%2Ficons%2Fandroid-chrome-512x512.png)

### Prerequisites

- Firebase
  - Create new project
    - Enable Google Analytics (optional)
  - Setup Authentication
    - Enable Google sign-in
    - Specify authorized domains
  - Setup Cloud Firestore
    - Enable production mode
    - Select closest region
    - Set database rules
      ```
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /tree/{node} {
            allow create: if request.auth.uid == request.resource.data.userId
            allow read, update, delete: if request.auth.uid == resource.data.userId
          }
        }
      }
      ```
  - Create new web-app under project
  - Use `firebaseConfig` values for env vars
