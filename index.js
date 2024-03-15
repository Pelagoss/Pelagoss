async function githubFetch(url) {
    return (await fetch(`https://api.github.com${url}`, {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })).json()
}

async function fetchRepositories(username, exclusions = []) {
    let data = await githubFetch(`/users/${username}/repos`);

    return data.filter(r => !exclusions.includes(r.name)).map(r => r.full_name);
}

async function fetchLanguagesStatsRepository(repoName) {
    let data = await githubFetch(`/repos/${repoName}/languages`);

    return data;
}

async function getLanguagesStatsFromProfile(username) {
    let repos = await fetchRepositories(username, ['symfony', username]);

    let gloabalLanguages = {};

    for (const repo in repos) {
        if (Object.hasOwnProperty.call(repos, repo)) {
            const element = repos[repo];
            
            let repoLanguages = await fetchLanguagesStatsRepository(element);

            Object.keys(repoLanguages).forEach((k) => {
                gloabalLanguages[k] = (gloabalLanguages[k] ?? 0) + repoLanguages[k];
            });
        }
    }

    let stats = Object.keys(gloabalLanguages).map(k => ({name: k, value: (Math.round(gloabalLanguages[k]/Object.keys(gloabalLanguages).map((k) => gloabalLanguages[k]).reduce((a,b) => a + b, 0)*1000)/10)})).sort((a,b) => b.value - a.value)
    
    let insignifiants = stats.filter(s => s.value < 1);

    stats = stats.filter(s => !insignifiants.map(i => i.name).includes(s.name));

    stats.push({name: 'Other', value: Math.round(insignifiants.reduce((a,b) => a + b.value, 0))});
}

let languages = getLanguagesStatsFromProfile('Pelagoss');

let badgeMap = {
    'Vue': {
        bgColor: '#35495e',
        logo: 'vuedotjs',
        logoColor: '#4FC08D',
    },
    'CSS': {
        bgColor: '#1572B6',
        logo: 'css3',
        logoColor: 'white',
    },
    'Python': {
        bgColor: '#3670A0',
        logo: 'python',
        logoColor: '#ffdd54',
    },
    'PHP': {
        bgColor: '#777BB4',
        logo: 'php',
        logoColor: 'white',
    },
    'JavaScript': {
        bgColor: '#323330',
        logo: 'javascript',
        logoColor: '#F7DF1E',
    },
    'HTML': {
        bgColor: '#E34F26',
        logo: 'html5',
        logoColor: 'white',
    },
    'SCSS': {
        bgColor: 'hotpink',
        logo: 'sass',
        logoColor: 'white',
    },
    'Other': {
        bgColor: '#2A2F3D',
        logo: null,
        logoColor: null,
    }
}

//![Name](https://img.shields.io/badge/stylus-%23ff6347.svg?style=for-the-badge&logo=stylus&logoColor=white)
