import random
from time import sleep

import pulsar

client = pulsar.Client("pulsar://10.2.115.98:6650")
print("Pulsar Python client version:", pulsar.__version__)

# Create a producer on the topic with tenant and namespace
topic = 'persistent://babblebox/audio_processing/test'
producer = client.create_producer(topic)

# Now you can send messages
for i in range(100, 500):
    # random_num = random.randint(1, 3)
    # sleep(random_num)
    producer.send(('hello-pulsar-%d' % i).encode('utf-8'))
    print("Message sent: ", i)
# Close the producer and client after done
producer.close()
client.close()