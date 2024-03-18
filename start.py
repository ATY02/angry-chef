import subprocess
import platform

BASE_PATH = ''  # Todo - replace this with your path to the app

processes = []


def start(command):
    if platform.system() == 'Windows':
        win_process = subprocess.Popen(['cmd', '/k', command], shell=True)
        processes.append(win_process)
    elif platform.system() == 'Darwin':
        mac_process = subprocess.Popen(['osascript', '-e', 'tell app "Terminal" to do script "{}"'.format(command)],
                                       shell=False)
        processes.append(mac_process)


def close_all_processes():
    for process in processes:
        process.terminate()


commands = [
    f'cd {BASE_PATH}/backend && python -m uvicorn gemini:app --reload --port 8000',
    f'cd {BASE_PATH}/backend && python -m uvicorn main:app --reload --port 8001',
    f'cd {BASE_PATH}/frontend && npm install && npm run dev',
]

print('Starting RamsayAI...')

for cmd in commands:
    start(cmd)

print('Application Started (see individual terminal windows for subprocess outputs)')
