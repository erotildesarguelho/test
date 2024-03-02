# Imagem base
FROM python:3.8

# Define o diretório de trabalho
WORKDIR /home/app

#Copia todos os arquivos para o Container
COPY . /home/app

# Instala as dependências do Python
RUN pip3 install --upgrade --no-cache-dir pip
RUN pip3 install fastapi
# RUN pip3 install fastapi-jwt-auth
# RUN pip3 install PyJWT
RUN pip3 install pydantic
RUN pip3 install uvicorn
# RUN pip3 install reportlab
# RUN pip3 install mysql-connector-python


ENV PYTHONPATH=/home/app
ENV PORT=8000

EXPOSE 8000

# Define o comando a ser executado quando o container for iniciado
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000","--reload"]