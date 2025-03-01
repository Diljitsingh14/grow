# Use an official Python runtime as a base image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cron

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project code into the container
COPY . /app/

# Ensure cron is started with the container
CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput && python manage.py crontab add && cron && gunicorn grow.wsgi --bind 0.0.0.0:8000"]
