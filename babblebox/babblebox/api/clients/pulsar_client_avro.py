import pulsar
from avro.io import DatumWriter, BinaryEncoder
import io
from djang.conf import settings

from pulsar.schema import BytesSchema

topic = settings.NEW_MESSAGE_TOPIC
client = None
producer = None
try:
    client = pulsar.Client(settings.PULSAR_URL)
    print("No client created")
    producer = client.create_producer(topic, schema=BytesSchema())
except Exception as e:
    print("Exception raised" + str(e))

class PulsarClient:
    @classmethod
    # Function to serialize Django model to Avro
    def serialize_to_avro(cls, data, avro_schema):
        writer = DatumWriter(avro_schema)
        bytes_writer = io.BytesIO()
        encoder = BinaryEncoder(bytes_writer)
        writer.write(data, encoder)

        return bytes_writer.getvalue()

    @classmethod
    def send_message(cls, data, schema):
        try:
            serialized_data = PulsarClient.serialize_to_avro(data, schema)
            producer.send(serialized_data)
            print("Message sent to pulsar for new transcription")
        except Exception as e:
            print("Exception raised" + str(e))
