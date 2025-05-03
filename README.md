# Interview Coach - Web App Documentation

## 📥 Initial Setup

### Cloning the Repository

1. Navigate to the Interview Coach repository.
2. Click the green **"Code"** button and copy the HTTPS link provided.
3. Open your local terminal.
4. Execute the command:

```bash
git clone <copied HTTPS link>
```

This will create a new folder named `interview-coach` on your local device.

---

## 🛠 Preparing Local Environment

After cloning the repository, set up your local development environment.

### Frontend (Next.js)

If you’re using VSCode:

```bash
cd interview-coach
npm install
npm run dev
```

Otherwise, open the folder manually in your IDE and run the same commands above.

> **Note:**  
> Run `npm install` every time you pull changes from the repository in case new dependencies have been added.

Repository link:  
[https://github.com/Dothat65/interview-coach](https://github.com/Dothat65/interview-coach)

---

### Backend (Python + FastAPI)

Change the directory to the folder containing the backend Python script:

```bash
cd ./app/mockInterview/
uvicorn main:app
```

> **Important:**  
> You must create a `.env` file in the backend folder with your API key:

```
OPENAI_API_KEY=<your-api-key>
```

---

## 🌿 Branches

Before you begin coding, make sure you are on your own branch so that your work saves properly and can be pushed for others to review.

To create your branch:

```bash
git checkout -b yourname
```

To check which branch you are on:

```bash
git branch
```

> **Tip:**  
> Commit and push as often as possible to your branch.

---

## 🚀 Workflow

After completing your work:

- Push your work to your branch.
- Create a **Pull Request (PR)** to the `development` branch.
- Please commit frequently to make reviewing easier.
- Once reviewed, PRs will be merged into `development`.  
- **Main** will only be updated occasionally (typically once a week).

> **Important:**  
> Always pull the latest changes from `development` and merge them into your branch before working each day:

```bash
git checkout development
git pull
git checkout yourname
git merge development
```

This prevents merge conflicts down the road.

---