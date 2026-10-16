import { readFile } from 'fs/promises';
import { join } from 'path';

const DEPLOYED_COMMIT_FILE = '.git-deploy-commit';

// git-deploy-toolkit leaves the deployed commit in this file on every deploy (sha, then the commit date), since the
// deployed tree has no .git of its own that would know which commit is running.
export async function getGitData(): Promise<{ hash: string; timeAgo: string }> {
  let contents: string;
  try {
    contents = await readFile(join(process.cwd(), DEPLOYED_COMMIT_FILE), 'utf8');
  } catch (e) {
    throw new Error(`Could not read ${DEPLOYED_COMMIT_FILE} (is this a deployed build?): ${e instanceof Error ? e.message : String(e)}`);
  }

  const [sha = '', date = ''] = contents.trim().split('\n');
  const time = Date.parse(date);
  if (!/^[0-9a-f]{40}$/.test(sha) || Number.isNaN(time)) {
    throw new Error(`${DEPLOYED_COMMIT_FILE} has an unexpected format`);
  }
  return { hash: sha.slice(0, 7), timeAgo: String(Math.floor(time / 1000)) };
}
