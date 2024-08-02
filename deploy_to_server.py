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


def rm_folder(folder: str):
    if os.path.exists(folder) and os.path.isdir(folder):
        shutil.rmtree(folder)


def build(authority_url: str, client_id: str, backend_url: str, frontend_url: str):
    rm_folder("node_modules")
    subprocess.run([yarn, "install"], check=True)
    rm_folder("dist")
    build_command = (f"export VITE_BACKEND_DOMAIN={backend_url}; "
                     f"export VITE_ZITADEL_AUTHORITY_URL={authority_url}; "
                     f"export VITE_ZITADEL_CLIENT_ID={client_id}; "
                     f"export VITE_FRONTEND_DOMAIN={frontend_url}; "
                     f"export GENERATE_SOURCEMAP=false; yarn build")
    subprocess.run(build_command, shell=True, check=True)


def deploy(server_domain: str, path_to_app_dir: str):
    copy_command = f"scp -r dist/* {server_domain}:{path_to_app_dir}/volumes/www/"
    subprocess.run(copy_command, shell=True, check=True)


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
    server_domain = 'root@services.econgood.org' if args.environment == 'prod' else 'root@dev.econgood.org'
    path_to_app_dir = '/var/docker/balance-sheet' if args.environment == 'prod' else '/var/docker/e-calculator-frontend'
    backend_url = 'https://balance-sheet-api.econgood.org' if args.environment == 'prod' else 'https://balance-sheet-api.dev.econgood.org'
    frontend_url = 'https://balance-sheet.econgood.org' if args.environment == 'prod' else 'https://balance-sheet.dev.econgood.org'
    client_id = '263455475041894403@econgood' if args.environment == 'prod' else '278679701701083139@econgood'
    authority_url = 'https://zitadel.econgood.org' if args.environment == 'prod' else 'https://zitadel.dev.econgood.org'
    logging.info(f"Build using backend api {backend_url} and frontend url {frontend_url} "
                 f"and client id {client_id} and authority url {authority_url}")
    build(backend_url=backend_url, frontend_url=frontend_url, client_id=client_id, authority_url=authority_url)
    logging.info(f"Deployment to {server_domain} and path {path_to_app_dir}")
    deploy(server_domain=server_domain, path_to_app_dir=path_to_app_dir)
    logging.info(f"Deployment finished")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    parser = argparse.ArgumentParser(description='Deploy e calculator ui')
    parser.add_argument('environment',
                        choices=['test', 'prod'],
                        help='Deploy it either to the test or prod environment')
    args = parser.parse_args()
    main(args)
