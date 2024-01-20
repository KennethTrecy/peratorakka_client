[![Web Front-end Tests](https://img.shields.io/github/actions/workflow/status/KennethTrecy/peratorakka_client/front-end.yml?style=for-the-badge)](https://github.com/KennethTrecy/peratorakka_client/actions/workflows/front-end.yml)
![GitHub lines](https://img.shields.io/github/license/KennethTrecy/peratorakka_client?style=for-the-badge)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/KennethTrecy/peratorakka_client?style=for-the-badge&display_name=tag&sort=semver)
![GitHub closed issues count](https://img.shields.io/github/issues-closed/KennethTrecy/peratorakka_client?style=for-the-badge)
![GitHub pull request count](https://img.shields.io/github/issues-pr-closed/KennethTrecy/peratorakka_client?style=for-the-badge)
![GitHub code size in bytes](https://img.shields.io/github/repo-size/KennethTrecy/peratorakka_client?style=for-the-badge)

# Peratorakka Client
A client for any Peratorakka server.

## Purpose
The purpose of this system is to track the cash flow and create financial statements automatically.
The system allows the users (persons or businesses) to manage their financies.

Screenshots of this project can be found in [author's post]. Currently, there is no server available
to access by common people. Yet, the instructions how to start the system can be found below.

## Origin
Some parts of the repository was based from [`sveltekit`] branch of [Web Template].

The template has been specialized for front-end development.

## Usage

### Initialization
If you want to contribute, the repository should be initialized to adhere in [Conventional Commits
specification] for organize commits and automated generation of change log.

#### Prerequisites
- [Node.js environment]
- [pnpm] (optional)

#### Instructions
By running the command below, all your commits will be linted to follow the [Conventional Commits
specification].
```
$ npm install
```

Or if you have installed [pnpm], run the following command:
```
$ pnpm install
```

To generate the change log automatically, run the command below:
```
$ npx changelogen --from=[tag name or branch name or commit itself] --to=master
```

## Notes

### Want to contribute?
Read the [contributing guide] for different ways to contribute in the project.

### Author
Coded by Kenneth Trecy Tobias.

### Disclaimer
This personal project may contain references to trademarks, which are included in good faith. However, it is important to note that such references do not indicate any endorsement, affiliation, or sponsorship by the respective trademark holders unless explicitly stated.

[`sveltekit`]: https://github.com/KennethTrecy/web_template/tree/sveltekit
[Web Template]: https://github.com/KennethTrecy/web_template/
[MIT]: https://github.com/KennethTrecy/web_template/blob/master/LICENSE
[Node.js environment]: https://nodejs.org/en/
[pnpm]: https://pnpm.io/installation
[Conventional Commits specification]: https://www.conventionalcommits.org/en/v1.0.0/
[contributing guide]: ./CONTRIBUTING.md
[author's post]: https://www.linkedin.com/posts/kenneth-trecy-tobias_good-day-everyone-after-five-months-of-testing-activity-7134037085828616192-Xtvx
