для запуска

python -m venv venv
для windows
venv\Scripts\Activate.ps1
для Linux
source ./venv/bin/activate
pip install -r requirements.txt
python manage.py runserver

для генерации статической версии сайта необходимо:
запустить сервер
залогинится
скопировать содержимое куки sessionid и вставить его в файле gen_preview.py
запустить скрипт gen_preview.py