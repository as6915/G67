const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// URL لمستودع GitHub
const githubRepoUrl = 'https://api.github.com/repos/as6915/pa/contents/';

// دالة لتحميل الملفات من GitHub
const downloadFilesFromGitHub = async () => {
    try {
        const response = await axios.get(githubRepoUrl, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        const files = response.data;
        files.forEach(async file => {
            if (file.type === 'file') {
                const fileResponse = await axios.get(file.download_url);
                fs.writeFileSync(path.join(__dirname, 'public', file.name), fileResponse.data);
            }
        });
    } catch (error) {
        console.error('Error downloading files:', error);
    }
};

// تحميل الملفات عند بدء تشغيل الخادم
downloadFilesFromGitHub();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
