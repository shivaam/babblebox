from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_user_username"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="username",
            field=models.CharField(blank=True, max_length=255, unique=True, verbose_name="username"),
        ),
        migrations.AddIndex(
            model_name="user",
            index=models.Index(fields=["username"], name="username_idx"),
        ),
    ]
