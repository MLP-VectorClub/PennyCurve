#!/usr/bin/env bash
read oldrev newrev refname
echo "Push triggered update to revision $newrev ($refname)"

GIT="env -i git"
CMD_PWD="cd .. && pwd"
CMD_FETCH="$GIT fetch"
CMD_NPM="npm install --production --no-save"
CMD_VERSION="npm run write-git-info"
CMD_RESTART="pm2 restart pm2.json"

echo "$ $CMD_PWD"
eval $CMD_PWD
echo "$ $CMD_FETCH"
eval $CMD_FETCH

if $GIT diff --name-only $oldrev $newrev | grep "^package-lock.json"; then
	echo "$ $CMD_NPM"
	eval $CMD_NPM
else
	echo "# Skipping npm install, lockfile not modified"
fi

echo "$ $CMD_VERSION"
eval $CMD_VERSION
echo "$ $CMD_RESTART"
eval $CMD_RESTART
