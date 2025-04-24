import requests
import keyboard
import pyautogui

def get_public_ip():
    response = requests.get('https://api.ipify.org?format=json')
    response.raise_for_status()
    ip_info = response.json()
    return ip_info['ip']

def send_ip():
    ip = get_public_ip()
    pyautogui.write(ip)

keyboard.add_hotkey('alt+v', send_ip)

keyboard.wait()