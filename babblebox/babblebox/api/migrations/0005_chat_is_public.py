# Generated by Django 4.2.9 on 2024-03-06 17:35

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0004_chat_participants"),
    ]

    operations = [
        migrations.AddField(
            model_name="chat",
            name="is_public",
            field=models.BooleanField(default=False),
        ),
    ]
