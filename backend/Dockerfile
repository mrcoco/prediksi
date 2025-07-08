FROM python:3.9

WORKDIR /app

# Install system dependencies including PostgreSQL client
RUN apt-get update && \
    apt-get install -y \
    graphviz \
    default-jre \
    wget \
    unzip \
    postgresql-client \
    libpq-dev

# Install JMeter
RUN wget https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.6.3.tgz \
    && tar -xzf apache-jmeter-5.6.3.tgz \
    && rm apache-jmeter-5.6.3.tgz \
    && mv apache-jmeter-5.6.3 /opt/jmeter

ENV PATH="/opt/jmeter/bin:${PATH}"

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]