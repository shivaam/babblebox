import pulsar
import io
from avro.io import DatumReader, BinaryDecoder
from avro.schema import Parse, Schema

topic = 'persistent://babblebox/audio_processing/test'

client = pulsar.Client('pulsar://10.2.115.98:6650')
print("Pulsar Python client version:", pulsar.__version__)

consumer = client.subscribe(topic, subscription_name='my-sub')

# Define your Avro schema
schema_path = '../schemas/chat_message_schema.avsc'
with open(schema_path, 'r') as file:
    schema = Parse(file.read())


def deserialize_from_avro(data, avro_schema):
    bytes_reader = io.BytesIO(data)
    decoder = BinaryDecoder(bytes_reader)
    reader = DatumReader(avro_schema)
    return reader.read(decoder)


while True:
    msg = consumer.receive()
    #print(deserialize_from_avro(msg.data(), schema))
    print("Received message: '%s'" % msg.data())
    consumer.acknowledge(msg)

client.close()
