import express from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import axios from "axios";
import { errorHandler } from '../utils/error.js'; 

export const  repo = async (req, res) => {
    
    try {
        const response = await axios.get(`https://api.github.com/user/repos`, {
        headers: { Authorization: `token ${req.user.accessToken}` },
    });
        res.json(response.data);
    } catch (err) {
        console.error('GitHub API error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Error fetching repos' });
    }
}


export const getRepoById = async (req, res) => {
    try {
        const repoId = req.params.id;
        const accessToken = req.user.accessToken;

        // Get all repos first (since GitHub doesn’t offer /repos/:id)
        const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/vnd.github+json',
        },
    });

    const repos = response.data;

    // Find repo with matching ID
    const repo = repos.find(r => r.id.toString() === repoId);

        if (!repo) {
        return res.status(404).json({ error: 'Repository not found' });
        }

        res.status(200).json(repo);
    } catch (err) {
        console.error('Error fetching repo by ID:', err.response?.data || err.message);
        res.status(500).json({ error: 'Error fetching repository details' });
    }
};


// controllers/repo.controller.js

export const getPullRequests = async (req, res, next) => {
    try {
    const repoId = String(req.params.id); // Always convert to String

    // First: Fetch all user repos to find owner + repo name
    const reposResponse = await axios.get('https://api.github.com/user/repos', {
        headers: { Authorization: `token ${req.user.accessToken}` },
    });

    const repo = reposResponse.data.find((r) => String(r.id) === repoId);

    if (!repo) {
        return res.status(404).json({ error: 'Repository not found' });
    }

    const owner = repo.owner.login;
    const repoName = repo.name;

    const pullsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/pulls?per_page=100`, {
        headers: { Authorization: `token ${req.user.accessToken}` },
    });

    res.json(pullsResponse.data);
    } catch (error) {
        if (!res.headersSent) next(error);
    }
};



// controllers/repo.controller.js

export const getIssues = async (req, res, next) => {
    try {
        const repoId = String(req.params.id); // Always convert to String

    // First: Fetch all user repos to find owner + repo name
        const reposResponse = await axios.get('https://api.github.com/user/repos', {
            headers: { Authorization: `token ${req.user.accessToken}` },
        });

        const repo = reposResponse.data.find((r) => String(r.id) === repoId);

        if (!repo) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        const owner = repo.owner.login;
        const repoName = repo.name;

    // Now: Fetch issues for this repo
        const issuesResponse = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/issues?state=open&per_page=100`, {
            headers: { Authorization: `token ${req.user.accessToken}` },
        });

    // Optional: If you want to exclude pull requests (keep only real issues):
        const issuesOnly = issuesResponse.data.filter((issue) => !issue.pull_request);

        res.json(issuesOnly); // Or res.json(issuesResponse.data) if you want to include PRs too
    } catch (error) {
        next(errorHandler("issues are not found in the repositories"));
    }
};



export const searchRepos = async (req, res, next) => {
    
    try {
        const { q, type } = req.query;

        if (!q || !type) {
            return res.status(400).json({ error: 'Missing required query parameters: q and type' });
        }

    // User repo search
        if (type === 'user') {
      // Fetch user repos
            const reposResponse = await axios.get('https://api.github.com/user/repos?per_page=100', {
            headers: { Authorization: `token ${req.user.accessToken}` },
        });

        const matchingRepos = reposResponse.data.filter((repo) =>
        repo.name.toLowerCase().includes(q.toLowerCase())
        );

      // Map to minimal response for autocomplete
        const suggestions = matchingRepos.map((repo) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            html_url: repo.html_url,
        }));

        return res.json(suggestions);
        }

    // Global search
        else if (type === 'global') {
            const searchResponse = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&per_page=10`, {
            headers: { Authorization: `token ${req.user.accessToken}` }, // Optional: can use public API too
        });

        const suggestions = searchResponse.data.items.map((repo) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            html_url: repo.html_url,
            owner: repo.owner.login,
            stars: repo.stargazers_count,
        }));

        return res.json(suggestions);
        }

    // Invalid type
        else {
            return res.status(400).json({ error: 'Invalid type parameter. Must be "user" or "global".' });
        }
    } catch (error) {
        console.error('Error in searchRepos:', error.response?.data || error.message);
        next({
            statusCode: error.response?.status || 500,
            message: error.response?.data?.message || error.message || 'Error in searchRepos',
        });
    }
};

