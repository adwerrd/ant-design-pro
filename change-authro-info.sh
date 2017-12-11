#!/bin/sh

git filter-branch --env-filter '
OLD_EMAIL="644506165@qq.com"
CORRECT_NAME="lan"
CORRECT_EMAIL="adwerrd@hotmail.com"
if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags


exit

# then:
git push --force --tags origin 'refs/heads/*'
