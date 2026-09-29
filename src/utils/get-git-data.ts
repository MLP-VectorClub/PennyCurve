import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import { join } from 'path';
import shellEscape from 'shell-escape';

// git-deploy-toolkit leaves the deployed commit in this file on every deploy (sha, then the commit date), since the
// deployed tree has no .git of its own that would know which commit is running.
const readDeployedCommit = async (): Promise<{ hash: string; timeAgo: string } | null> => {
  try {
    const [sha = '', date = ''] = (await readFile(join(process.cwd(), '.git-deploy-commit'), 'utf8')).trim().split('\n');
    const time = Date.parse(date);
    if (!/^[0-9a-f]{40}$/.test(sha) || Number.isNaN(time)) return null;
    return { hash: sha.slice(0, 7), timeAgo: String(Math.floor(time / 1000)) };
  } catch {
    return null;
  }
};

export async function getGitData(): Promise<{ hash: string; timeAgo: string }> {
  return (await readDeployedCommit()) ?? getGitDataFromGit();
}

function getGitDataFromGit(): Promise<{ hash: string; timeAgo: string }> {
  return new Promise((res, rej) => {
    const separator = ';';
    const command = shellEscape(`env -i git log -1 --date=short --pretty=format:%h${separator}%ct`.split(' '));
    exec(command, { cwd: process.cwd() }, (err, data) => {
      if (err) {
        console.error('Error getting commit data', err);
        rej(new Error('Error while getting commit data'));
        return;
      }

      const [hash, timeAgo] = data.trim()
        .split(separator);
      res({
        hash,
        timeAgo,
      });
    });
  });
}
