import argparse
import logging
import os
import shutil
import subprocess
import git

yarn = 'yarn'
run = 'run'
docker = 'docker'
compose = 'compose'


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


def check_types():
    subprocess.run([yarn, run, 'check-ts'], check=True)


def check_linting():
    subprocess.run([yarn, run, 'lint'], check=True)


def run_tests():
    my_env = os.environ.copy()
    my_env["CI"] = 'true'
    subprocess.run([yarn, run, 'test'], env=my_env, check=True)


def build_and_deploy_remotely(server_domain: str, backend_url: str, frontend_url: str):
    commands = [
        'source .nvm/nvm.sh',
        'cd e-calculator-frontend',
        'git pull',
        "rm -rf node_modules",
        f"{yarn} install",
        "rm -rf build",
        f"export VITE_BACKEND_DOMAIN={backend_url}; export VITE_FRONTEND_DOMAIN={frontend_url}; export GENERATE_SOURCEMAP=false; yarn build",
        f"{docker} {compose} down",
        f"{docker} {compose} up -d"
    ]
    full_command = " && ".join(commands)
    subprocess.run(['ssh', server_domain, full_command], check=True)


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
    logging.info(f"Check types")
    check_types()
    logging.info(f"Run tests")
    run_tests()
    server_domain = 'ecg@prod.econgood.org' if args.environment == 'prod' else 'ecg@dev.econgood.org'
    backend_url = 'https://balance-sheet-api.prod.econgood.org' if args.environment == 'prod' else 'https://balance-sheet-api.dev.econgood.org'
    frontend_url = 'https://balance-sheet.prod.econgood.org' if args.environment == 'prod' else 'https://balance-sheet.dev.econgood.org'
    logging.info(f"Build and deploy to {server_domain} and using backend api {backend_url} and frontend url {frontend_url}")
    build_and_deploy_remotely(server_domain=server_domain, backend_url=backend_url, frontend_url=frontend_url)
    logging.info(f"Deployment finished")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    parser = argparse.ArgumentParser(description='Deploy e calculator ui')
    parser.add_argument('environment',
                        choices=['test'],
                        help='Deploy it either to the test environment')
    args = parser.parse_args()
    main(args)
