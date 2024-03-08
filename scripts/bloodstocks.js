import { Octokit } from "octokit";


const API_KEY = process.env.API_KEY_GENERAL;
const octokit = new Octokit({ auth: API_KEY });

// console.log(API_KEY);

// const rate_limit = await octokit.rest.rateLimit.get();
// console.log(rate_limit);


// // Get the list of commits in the repo using Octokit
const bloodstocks_commits = await octokit.paginate("GET /repos/{owner}/{repo}/commits", {
// const bloodstocks_commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
    owner: "frizensami",
    repo: "red-cross-blood-stocks",
});
console.error("Received SHAs of " + bloodstocks_commits.length + " commits");

// console.log(bloodstocks_commits);

// // Get all the contents of blood-stocks.json file across all commits
let all_stocks = [];
// for (const commit of bloodstocks_commits.data) {
let idx = 0;
for (const commit of bloodstocks_commits) {
    idx++;
    const date = new Date(commit.commit.author.date);
    try {
        const bloodstocks = await octokit.rest.repos.getContent({
            owner: "frizensami",
            repo: "red-cross-blood-stocks",
            path: "blood-stocks.json",
            ref: commit.sha
        });
        const bloodstocks_data = JSON.parse(Buffer.from(bloodstocks.data.content, 'base64').toString('utf-8'));
        bloodstocks_data.forEach((d) => {
            all_stocks.push({date: date.toISOString().slice(0, 10), bloodType: d.bloodType, fillLevel: parseInt(d.fillLevel)});
        });
        console.error("Processed commit " + commit.sha + " at " + date.toISOString().slice(0, 10) + " with " + bloodstocks_data.length + " records" + " idx: " + idx + " of " + bloodstocks_commits.length);
    } catch (e) {
        // Ignore any errors and continue to the next commit
        console.error(e);
    }
}

// console.log(bloodstocks_data);


// Write out csv formatted data.
process.stdout.write(JSON.stringify(all_stocks));     
// process.stdout.write("[{}]");     

console.error("Done!")