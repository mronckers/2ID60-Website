# Generated by Django 2.1.5 on 2019-01-18 13:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rango', '0005_auto_20190118_1421'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todolist',
            name='open_status',
            field=models.BooleanField(default=True),
        ),
    ]