# Upmatch
Application that determines how much the Upwork freelancer profile matches the employer's preferences.

## Demo: https://upmatch.me

![Screenshot](https://github.com/plastiniq/upmatch/blob/master/screenshot.png)

## Local installation

### 1. Get API key
To run locally on your computer, you need an Upwork API key. You can request it here: https://www.upwork.com/services/api/apply

### 2. [Download](https://github.com/plastiniq/upmatch/archive/master.zip) files or clone the repository to your local machine

### 3. Create an .env File in the Root Folder With Files and Fill in the API Key Values
```
SESSION_SECRET = "xxxxxxxxxxxx"
UPWORK_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
UPWORK_SECRET = "xxxxxxxxxxxxxxxx"
```

### 4. Run the Project
```bash
cd upmatch-master
npm install # or yarn
npm run dev
```

Open up [localhost:3000](http://localhost:3000) and start clicking around.

Consult [sapper.svelte.dev](https://sapper.svelte.dev) for help getting started.