# Frameworks used

- [PhoneGap](http://phonegap.com)
- [AngularJS](http://angularjs.org)
- [Ionic](http://ionicframework.com/)

# Project

Project name: oaeApp

Based on creativityexercise.umn.edu

GitHub: https://github.com/origineight/oae-mobile-app

# Getting Started

**Requirements**

- Node.js, Ionic, Phonegap already setup, see INSTALL.md

## First Time
```
# clone the project from GitHub
$ git clone https://github.com/origineight/oae-mobile-app.git
$ git checkout -b develop --track origin/develop
$ git checkout -b production --track origin/production
```

**Git flow**
```
# If don't have git-flow, install as
$ wget -q -O - --no-check-certificate https://github.com/nvie/gitflow/raw/develop/contrib/gitflow-installer.sh | sudo bash

```
# Setup git flow
```
$ git flow init

Which branch should be used for bringing forth production releases?
 - develop
 - master
 - production
Branch name for production releases: [production]
Which branch should be used for integration of the "next release"?
 - develop
 - master
Branch name for "next release" development: [develop]
How to name your supporting branch prefixes?
Feature branches? [feature/]
Release branches? [release/]
Hotfix branches? [hotfix/]
Support branches? [support/]
Version tag prefix? []
```

**Setup node modules**
```
$ cd oae-mobile-app/oaeApp
$ sudo npm install

# Test
$ ionic serve
```

## General Dev
- follow git flow workflow
- work on the code, test
- commit and push upstream
