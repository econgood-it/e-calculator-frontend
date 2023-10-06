import argparse
import logging
import os
import shutil
import subprocess
import git

yarn = 'yarn'
run = 'run'


def has_unpushed_changes():
    try:
        repo = git.Repo('.')
        remote_branch = repo.active_branch.tracking_branch()

        if remote_branch:
            # Get the number of commits ahead of the remote tracking branch
            commits_ahead = repo.iter_commits(f'{remote_branch.name}..{repo.active_branch.name}')
            num_commits_ahead = sum(1 for _ in commits_ahead)

            if num_commits_ahead > 0:
                logging.info(f"There are {num_commits_ahead} committed but unpushed changes.")
                return True
            else:
                logging.info("Branch is up to date. No unpushed changes.")
                return False
        else:
            logging.info("The branch is not tracking a remote branch.")
            return False
    except git.exc.InvalidGitRepositoryError:
        logging.error("Error: Not a valid Git repository.")
        return False


def check_for_uncommitted_files():
    repo = git.Repo('.')
    if repo.is_dirty():
        raise Exception('Please commit your changes before a deployment')
    if has_unpushed_changes():
        raise Exception('Please push your changes before a deployment')


def install_dependencies():
    cmd = [yarn, 'install']
    subprocess.run(cmd, check=True)


def check_linting():
    subprocess.run([yarn, run, 'lint'], check=True)


def run_tests():
    my_env = os.environ.copy()
    my_env["CI"] = 'true'
    subprocess.run([yarn, run, 'test'], env=my_env, check=True)


def compile_typescript_to_javascript(backend_url: str):
    my_env = os.environ.copy()
    my_env["REACT_APP_BACKEND_DOMAIN"] = backend_url
    my_env["GENERATE_SOURCEMAP"] = 'false'
    subprocess.run([yarn, 'build'], env=my_env, check=True)


def rsync(folder: str, server_domain: str, server_folder: str):
    subprocess.run(['rsync', '-av', folder, f"{server_domain}:{server_folder}", '--delete'], check=True)


def rm_folder(folder: str):
    if os.path.exists(folder) and os.path.isdir(folder):
        shutil.rmtree(folder)


def main(args):
    logging.info(f"Start build and deployment process for the environment {args.environment}")
    check_for_uncommitted_files()
    logging.info(f"Install dependencies")
    rm_folder(folder='node_modules')
    install_dependencies()
    logging.info(f"Check linting")
    check_linting()
    logging.info(f"Run tests")
    run_tests()
    logging.info(f"Build and compile")
    rm_folder(folder='build')
    compile_typescript_to_javascript(backend_url='https://calculator.test.ecogood.org')
    server_domain = 'ecg04-bcalcweb_test@ecg04.hostsharing.net'
    server_folder = 'doms/ecalc.test.ecogood.org/htdocs-ssl'
    logging.info(f"Copy build folder to {server_domain}")
    rsync(folder='build/', server_domain=server_domain, server_folder=server_folder)
    logging.info(f"Deployment finished")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    parser = argparse.ArgumentParser(description='Deploy e calculator ui')
    parser.add_argument('environment',
                        choices=['test'],
                        help='Deploy it either to the test environment')
    args = parser.parse_args()
    main(args)
