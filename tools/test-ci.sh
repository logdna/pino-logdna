#!/bin/bash
mkdir -p coverage
npm run tap

code=$?
cat .tap | ./node_modules/.bin/tap-parser -t -f | ./node_modules/.bin/tap-xunit > coverage/test.xml
exit $code
