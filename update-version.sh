#!/bin/zsh

pushd ./app/assets/packages

git rm *.deb
git rm *.rpm

cp /tmp/nginx*.deb ./ -v
cp /tmp/nginx*.rpm ./ -v

git add *.deb *.rpm

popd


