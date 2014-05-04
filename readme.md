# Firebase Tutorial

This project is for testing firebase functionality wrapped in TypeScript, enshrined in custom typescript classes.

It has a set of tests designed to check the Firebase API and profile for changes.

## Getting started

This project primarily requires typescript, which can be installed to your command line using node package manager (npm).
```
npm install -g typescript
```

There are two typescript build scripts for this project:
```
tsc @build.tsc
```
and
```
tsc @build_tests.tsc
```

These produce outputs in the /bin/scripts/ and /bin/tests/ folders.

## Build with Grunt 
The project also supports grunt tasks.

To update the node packages for grunt, try:
```
npm install
```

And then to run the typescript build commands:
```
grunt shell
```

## FTP Deploy with Grunt
The grunt script is configured to upload to my website.
To modify this to support your own site:
	
* Edit Gruntfile.js 
** Set the value of FTP_HOST
** Set the value of FTP_PATH

* Rename .ftppass-template to .ftppass
** Add your FTP username
** Add your FTP password

To build and deploy, simply run:
```
grunt
```


	
