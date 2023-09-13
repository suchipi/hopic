# Hopic

snapshot testing for CLI app output

## installation

download from the github releases tab or get from npm with `npm i -g hopic`

## usage

write the commands you'd like to execute in a yml file with comments indicating the commands, like so:

```yml
#> ls

#> echo hi

#> pwd
```

Pass that yml file to hopic:

```
$ hopic myfile.yml
```

It'll execute all the commands and put their output after them:

```yml
#> ls
status: 0
stdout: |
  LICENSE
  README.md
  build.js
  dist
  kame.config.ts
  myfile.yml
  node_modules
  npm
  package-lock.json
  package.json
  sample
  src
  tsconfig.json
  types.d.ts
stderr: ""

#> echo hi
status: 0
stdout: |
  hi
stderr: ""

#> pwd
status: 0
stdout: |
  /Users/suchipi/Code/hopic
stderr: ""
```

Now if you run hopic again and the output doesn't match, it'll error. Pass `-u` or `--update` to ignore the error and replace the file contents with the new contents instead.

## filtering out machine-specific content from snapshots

You may wish to omit machine-specific content from snapshots. You can do this by specifying a `--config-file` that is a js/ts file that exports a `transformResult` function like so:

```js
const rootDir = GitRepo.findRoot(pwd()).toString();

function cleanStr(str) {
  return str.replaceAll(rootDir, "<rootDir>");
}

export const transformResult = (result) => {
  return {
    ...result,
    stdout: cleanStr(result.stdout),
    stderr: cleanStr(result.stderr),
  };
};
```

Now when you run hopic, the result from that `pwd` command will get transformed by your function:

```yml
#> pwd
status: 0
stdout: |
  <rootDir>
stderr: ""
```

## other stuff

- you can specify a `transformCmd` function in your `--config-file` to change how the command-line string gets turned into argv to run. The default implementation passes the entire line to `bash -c`.
- you can use `--dry-run` to not update any files
- normally, if a file is blank, you don't have to specify `-u` or `--update` to update its snapshots. But in CI, you do, because a blank file making it to CI is probably a mistake. This happens based on the CI environment variable being "true" or "1", or passing the `--ci` flag

## license

MIT
