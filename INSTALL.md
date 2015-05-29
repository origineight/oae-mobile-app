# Frameworks used

- [PhoneGap](http://phonegap.com)
- [AngularJS](http://angularjs.org)
- [Ionic](http://ionicframework.com/)

# Project

Project name: oaeApp

Based on creativityexercise.umn.edu


# Setup dev environment

## Install node.js via apt

ref: https://nodesource.com/blog/nodejs-v012-iojs-and-the-nodesource-linux-repositories

```
# setup script for Node.js v0.12
$ curl -sL https://deb.nodesource.com/setup_iojs_1.x | sudo bash -

# install with
$ sudo apt-get install -y nodejs
```

## Install Ionic
```
$ sudo npm install -g phonegap ionic gulp
```


## Setup project
**ONLY ONCE IN THE BEGINGING OF PROJECT**
```
$ ionic start creativityExerciseApp tabs
$ ionic setup sass
$ ionic serve
```

## Tools
- Ionic View
  - iOS: https://itunes.apple.com/us/app/ionic-view/id849930087?ls=1&mt=8
  - Android: https://play.google.com/store/apps/details?id=com.ionic.viewapp
